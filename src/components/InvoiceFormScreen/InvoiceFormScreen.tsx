import { findAccountSummary } from '@/api-client/account'
import { issueInvoice } from '@/api-client/invoice'
import { ClientDetails } from '@/types/client'
import { InvoiceFormData, InvoiceIssueRequest, InvoiceMutationResponse } from '@/types/invoice'
import { ProductDetails } from '@/types/products'
import { numberToBRLString, subtractCurrency } from '@/utils/currency'
import { activeInvoiceProductOptions, buildInvoiceRequest, calculateInvoicePreview } from '@/utils/invoice'
import { calculateCurrentOrderTotal } from '@/utils/orderTotals'
import { getCurrentOrderMonth, isFutureOrderPeriod, parseOrderMonth } from '@/utils/orderMonth'
import { isAmbiguousMutationError, isMutationConflictError, maxFinancialAmount } from '@/utils/payment'
import { queryFetch } from '@/utils/queryFetch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ConfirmDialog, FinancialState, PositionCards, primaryButton, secondaryButton } from '../Financial'
import InvoiceProductLine from '../InvoiceProductLine'
import { Input } from '../lib/Input/Input'
import Message from '../lib/Message'
import Select from '../lib/Select'

export function InvoiceFormScreen({ isSequence = false }: { isSequence?: boolean }) {
  const currentMonth = getCurrentOrderMonth()
  const queryClient = useQueryClient()
  const [clientIndex, setClientIndex] = useState(0)
  const [sequenceComplete, setSequenceComplete] = useState(false)
  const [confirmation, setConfirmation] = useState<InvoiceIssueRequest | null>(null)
  const [result, setResult] = useState<InvoiceMutationResponse | null>(null)
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<InvoiceFormData>({ defaultValues: { clientId: '', period: currentMonth, observation: '', products: [] } })
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'products' })
  const clientIdValue = useWatch({ control, name: 'clientId' })
  const period = useWatch({ control, name: 'period' })
  const selectedProducts = useWatch({ control, name: 'products' })
  const clientId = Number(clientIdValue)
  const clients = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const products = useQuery({
    queryKey: ['product/list'],
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
  })
  const account = useQuery({
    queryKey: ['client/account', { id: clientId }],
    queryFn: () => findAccountSummary(clientId),
    enabled: Number.isSafeInteger(clientId) && clientId > 0,
    staleTime: 0,
  })
  const clientOptions = useMemo(
    () =>
      clients.data
        ?.filter(({ active }) => active)
        .map(({ id, name }) => ({ value: String(id), label: `${name} · #${id}` })) ?? [],
    [clients.data]
  )
  const productOptions = useMemo(() => activeInvoiceProductOptions(products.data ?? []), [products.data])
  const productsTotal = calculateCurrentOrderTotal(selectedProducts ?? [], productOptions)
  const preview = account.data ? calculateInvoicePreview(account.data, productsTotal) : null
  const creditUsed = account.data && preview ? subtractCurrency(account.data.creditAmount, preview.creditAmount) : 0
  const mutation = useMutation({
    mutationFn: issueInvoice,
    retry: false,
    onSuccess: async (data) => {
      setConfirmation(null)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['invoice/list'] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/detail'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account/statement'] }),
        queryClient.invalidateQueries({ queryKey: ['report/client-balance'] }),
      ])
      if (isSequence) advance()
      else reset({ clientId: '', period, observation: '', products: [] })
      setResult(data)
    },
    onError: () => setConfirmation(null),
  })

  useEffect(() => {
    if (!isSequence || !clientOptions.length) return
    const bounded = Math.min(clientIndex, clientOptions.length - 1)
    setValue('clientId', String(clientOptions[bounded].value))
  }, [clientIndex, clientOptions, isSequence, setValue])

  function resetForClient(nextClientId: string) {
    reset({ clientId: nextClientId, period, observation: '', products: [] })
    replace([])
    setResult(null)
  }
  function advance() {
    if (!clientOptions.length) return
    const next = clientIndex + 1
    if (next >= clientOptions.length) {
      setSequenceComplete(true)
      resetForClient(String(clientOptions[0].value))
      setClientIndex(0)
      return
    }
    setSequenceComplete(false)
    resetForClient(String(clientOptions[next].value))
    setClientIndex(next)
  }
  function submit(data: InvoiceFormData) {
    setResult(null)
    if (!data.products.length && isSequence) return advance()
    if (!Number.isFinite(productsTotal) || productsTotal > maxFinancialAmount) {
      setError('products', { type: 'validate', message: 'O total dos produtos excede o limite permitido' })
      return
    }
    const request = buildInvoiceRequest(data)
    if (!request) {
      setError('products', {
        type: 'validate',
        message: data.products.length ? 'Revise produtos duplicados ou inválidos' : 'Adicione ao menos um produto',
      })
      return
    }
    if (account.isError) setConfirmation(request)
    else mutation.mutate(request)
  }

  if (clients.isPending || products.isPending)
    return (
      <section className='p-6'>
        <FinancialState>Carregando clientes e produtos...</FinancialState>
      </section>
    )
  if (clients.isError || products.isError)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>
          <span>Não foi possível carregar clientes ou produtos.</span>
          <button
            className={secondaryButton}
            onClick={() => {
              void clients.refetch()
              void products.refetch()
            }}
          >
            Tentar novamente
          </button>
        </FinancialState>
      </section>
    )
  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='invoice-form-title'>
      <header>
        <h1 id='invoice-form-title' className='text-lg font-semibold'>
          {isSequence ? 'Sequência de faturamento' : 'Emitir fatura'}
        </h1>
        <p className='text-sm text-gray-600'>
          {isSequence
            ? 'Navegue pelos clientes ativos; pular não salva um fechamento sem consumo.'
            : 'Registre os produtos consumidos na competência.'}
        </p>
      </header>
      {clientOptions.length === 0 && <FinancialState>Nenhum cliente ativo disponível para faturamento.</FinancialState>}
      {productOptions.length === 0 && (
        <FinancialState>Nenhum produto ativo disponível para faturamento.</FinancialState>
      )}
      {sequenceComplete && (
        <FinancialState>Sequência concluída. A navegação retornou ao primeiro cliente.</FinancialState>
      )}
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(submit)}>
        <div className='grid gap-4 md:grid-cols-3'>
          <div>
            <Controller
              control={control}
              name='clientId'
              rules={{ required: 'Selecione um cliente' }}
              render={({ field }) => (
                <Select
                  label='Cliente'
                  items={clientOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSequence}
                />
              )}
            />
            {errors.clientId && <Message>{errors.clientId.message}</Message>}
          </div>
          <div>
            <Input
              type='month'
              label='Competência'
              max={currentMonth}
              {...register('period', {
                required: 'Informe a competência',
                validate: (value) => {
                  const parsed = parseOrderMonth(value)
                  return (parsed && !isFutureOrderPeriod(parsed)) || 'Competência futura não é permitida'
                },
              })}
            />
            {errors.period && <Message>{errors.period.message}</Message>}
          </div>
          <Input label='Observação' maxLength={1000} {...register('observation')} />
        </div>
        {!clientIdValue ? (
          <FinancialState>Selecione um cliente para consultar a posição atual.</FinancialState>
        ) : account.isPending ? (
          <FinancialState>Consultando posição da conta...</FinancialState>
        ) : account.isError ? (
          <FinancialState role='alert'>
            <span>Posição indisponível. A emissão continua possível após confirmação reforçada.</span>
            <button type='button' className={secondaryButton} onClick={() => account.refetch()}>
              Tentar novamente
            </button>
          </FinancialState>
        ) : account.data && preview ? (
          <section className='flex flex-col gap-3' aria-label='Estimativa financeira da fatura'>
            <PositionCards position={account.data} openInvoiceCount={account.data.openInvoiceCount} />
            <dl className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-xl border p-4'>
                <dt className='text-xs text-gray-500'>Produtos da fatura</dt>
                <dd className='mt-2 font-semibold'>{numberToBRLString(productsTotal)}</dd>
              </div>
              <div className='rounded-xl border p-4'>
                <dt className='text-xs text-gray-500'>Crédito estimado utilizado</dt>
                <dd className='mt-2 font-semibold'>{numberToBRLString(creditUsed)}</dd>
              </div>
              <div className='rounded-xl border bg-gray-50 p-4'>
                <dt className='text-xs text-gray-500'>Estimativa após emissão</dt>
                <dd className='mt-2 font-semibold'>
                  {preview.position === 'credit' ? 'Crédito' : preview.position === 'debt' ? 'Dívida' : 'Quitado'} ·{' '}
                  {numberToBRLString(Math.abs(preview.netBalance))}
                </dd>
              </div>
            </dl>
          </section>
        ) : null}
        <section className='flex flex-col gap-3 border-t pt-5' aria-labelledby='invoice-products-title'>
          <div className='flex items-center justify-between gap-3'>
            <h2 id='invoice-products-title' className='font-semibold'>
              Produtos
            </h2>
            <strong className='tabular-nums'>Total: {numberToBRLString(productsTotal)}</strong>
          </div>
          {fields.map(({ id }, index) => (
            <InvoiceProductLine
              key={id}
              index={index}
              control={control}
              products={productOptions}
              remove={() => remove(index)}
            />
          ))}
          {errors.products && <Message>{errors.products.message}</Message>}
          <button
            type='button'
            className={`${secondaryButton} self-start`}
            onClick={() => append({ productId: '', quantity: '1' })}
          >
            Adicionar produto
          </button>
        </section>
        {mutation.isError && (
          <FinancialState role='alert'>
            {isMutationConflictError(mutation.error)
              ? 'Já existe uma fatura ativa nessa competência ou o cliente possui uma fatura posterior. Os dados foram preservados.'
              : isAmbiguousMutationError(mutation.error)
                ? 'Não foi possível confirmar o resultado. Confira a lista de faturas e o extrato antes de tentar novamente; os dados foram preservados.'
                : 'Não foi possível emitir a fatura. Os dados foram preservados para revisão.'}
          </FinancialState>
        )}
        <button
          className={`${primaryButton} self-end`}
          disabled={mutation.isPending || (clientId > 0 && account.isPending) || clientOptions.length === 0}
        >
          {mutation.isPending ? 'Emitindo...' : isSequence && fields.length === 0 ? 'Pular cliente' : 'Emitir fatura'}
        </button>
      </form>
      {result && (
        <FinancialState>
          Fatura #{result.invoice.id} emitida. Em aberto: {numberToBRLString(result.invoice.openAmount)}.
        </FinancialState>
      )}
      <ConfirmDialog
        open={Boolean(confirmation)}
        title='Emitir sem consultar a posição?'
        confirmLabel='Emitir mesmo assim'
        pending={mutation.isPending}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => confirmation && mutation.mutate(confirmation)}
      >
        <p>A posição atual não pôde ser carregada. Confira cliente, competência e produtos antes de confirmar.</p>
      </ConfirmDialog>
    </section>
  )
}
