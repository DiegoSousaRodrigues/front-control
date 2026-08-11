import { findAccountSummary } from '@/api-client/account'
import { createPayment } from '@/api-client/payment'
import { ClientDetails } from '@/types/client'
import { PaymentCreateRequest, PaymentMutationResponse } from '@/types/payment'
import { BRLStringToNumber, numberToBRLString } from '@/utils/currency'
import {
  calculatePaymentPreview,
  getTodayInSaoPaulo,
  hasValidCentPrecision,
  isAmbiguousMutationError,
  maxFinancialAmount,
} from '@/utils/payment'
import { queryFetch } from '@/utils/queryFetch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { Input } from '../lib/Input/Input'
import Select from '../lib/Select'
import Message from '../lib/Message'
import {
  AccountSummaryBlock,
  ConfirmDialog,
  FinancialState,
  PositionCards,
  primaryButton,
  secondaryButton,
} from '../Financial'

type FormData = { clientId: string; effectiveDate: string; amount: string; observation: string }

export function PaymentFormScreen() {
  const today = getTodayInSaoPaulo()
  const queryClient = useQueryClient()
  const [confirmation, setConfirmation] = useState<PaymentCreateRequest | null>(null)
  const [result, setResult] = useState<PaymentMutationResponse | null>(null)
  const [ambiguousResult, setAmbiguousResult] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { clientId: '', effectiveDate: today, amount: '', observation: '' } })
  const clientId = Number(watch('clientId'))
  const amount = BRLStringToNumber(watch('amount'))
  const clients = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const account = useQuery({
    queryKey: ['client/account', { id: clientId }],
    queryFn: () => findAccountSummary(clientId),
    enabled: Number.isSafeInteger(clientId) && clientId > 0,
    staleTime: 0,
  })
  const accountData = account.data
  const mutation = useMutation({
    mutationFn: createPayment,
    retry: false,
    onSuccess: async (data) => {
      setResult(data)
      setAmbiguousResult(false)
      setConfirmation(null)
      resetField('amount')
      resetField('observation')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['client/account'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account/statement'] }),
        queryClient.invalidateQueries({ queryKey: ['payment/list'] }),
        queryClient.invalidateQueries({ queryKey: ['payment/detail', { id: data.id }] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/list'] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/detail'] }),
        queryClient.invalidateQueries({ queryKey: ['report/financial'] }),
      ])
    },
    onError: (error) => {
      setAmbiguousResult(isAmbiguousMutationError(error))
      setConfirmation(null)
    },
  })
  const options = useMemo(
    () =>
      clients.data?.map((client) => ({
        value: String(client.id),
        label: `${client.name} · #${client.id}${client.active ? '' : ' (inativo)'}`,
      })) ?? [],
    [clients.data]
  )
  const preview =
    accountData && Number.isFinite(amount) && amount > 0 ? calculatePaymentPreview(accountData, amount) : null

  function submit(data: FormData) {
    setResult(null)
    setAmbiguousResult(false)
    const numericAmount = BRLStringToNumber(data.amount)
    const request = {
      clientId: Number(data.clientId),
      amount: numericAmount,
      effectiveDate: data.effectiveDate,
      observation: data.observation.trim() || null,
    }
    if (account.isError || (accountData && calculatePaymentPreview(accountData, numericAmount).position === 'credit'))
      setConfirmation(request)
    else mutation.mutate(request)
  }

  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='payment-add-title'>
      <header>
        <h1 id='payment-add-title' className='text-lg font-semibold'>
          Registrar pagamento
        </h1>
        <p className='text-sm text-gray-600'>
          O pagamento reduz a dívida e o excedente permanece como crédito do cliente.
        </p>
      </header>
      {clients.isPending ? (
        <FinancialState>Carregando clientes...</FinancialState>
      ) : clients.isError ? (
        <FinancialState role='alert'>
          <span>Não foi possível carregar os clientes.</span>
          <button className={secondaryButton} onClick={() => clients.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      ) : options.length === 0 ? (
        <FinancialState>Nenhum cliente disponível para registrar pagamento.</FinancialState>
      ) : (
        <form
          onSubmit={handleSubmit(submit)}
          className='flex max-w-3xl flex-col gap-5 rounded-xl border border-gray-200 p-4 sm:p-6'
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <Controller
                control={control}
                name='clientId'
                rules={{ required: 'Selecione um cliente' }}
                render={({ field }) => (
                  <Select label='Cliente' items={options} value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.clientId && <Message>{errors.clientId.message}</Message>}
            </div>
            <div>
              <Input
                type='date'
                label='Data efetiva'
                aria-label='Data efetiva do pagamento'
                aria-invalid={Boolean(errors.effectiveDate)}
                max={today}
                {...register('effectiveDate', {
                  required: 'Informe a data',
                  validate: (value) => value <= today || 'Datas futuras não são permitidas',
                })}
              />
              {errors.effectiveDate && <Message>{errors.effectiveDate.message}</Message>}
            </div>
            <div>
              <Input
                label='Valor'
                aria-label='Valor do pagamento'
                aria-invalid={Boolean(errors.amount)}
                mask='currency'
                inputMode='numeric'
                {...register('amount', {
                  required: 'Informe o valor',
                  validate: (value) => {
                    const parsed = BRLStringToNumber(value)
                    return (
                      (parsed > 0 && parsed <= maxFinancialAmount && hasValidCentPrecision(parsed)) ||
                      'Informe um valor válido, maior que zero'
                    )
                  },
                })}
              />
              {errors.amount && <Message>{errors.amount.message}</Message>}
            </div>
          </div>
          <label className='flex flex-col gap-1 text-xs text-primary'>
            Observação
            <textarea
              maxLength={1000}
              {...register('observation')}
              className='min-h-24 rounded-lg border border-gray-200 p-3 text-sm text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
            />
          </label>
          {clientId > 0 &&
            (account.isPending ? (
              <FinancialState>Carregando posição atual...</FinancialState>
            ) : account.isError ? (
              <FinancialState role='alert'>
                <span>Posição indisponível. Você ainda pode registrar após conferir os dados.</span>
                <button type='button' className={secondaryButton} onClick={() => account.refetch()}>
                  Tentar novamente
                </button>
              </FinancialState>
            ) : accountData ? (
              <AccountSummaryBlock summary={accountData} />
            ) : null)}
          {preview && (
            <div>
              <h2 className='mb-2 text-sm font-semibold'>Estimativa após o pagamento</h2>
              <PositionCards position={preview} />
            </div>
          )}
          {mutation.isError && (
            <FinancialState role='alert'>
              {ambiguousResult
                ? 'Não foi possível confirmar o resultado. Antes de reenviar, confira a lista de pagamentos ou o extrato para evitar duplicidade.'
                : 'O pagamento não foi registrado. Revise os dados informados e tente novamente.'}
            </FinancialState>
          )}
          <button
            className={primaryButton}
            disabled={mutation.isPending || (clientId > 0 && account.isPending)}
            type='submit'
          >
            {mutation.isPending ? 'Registrando...' : 'Registrar pagamento'}
          </button>
        </form>
      )}
      {result && (
        <FinancialState>
          <span>
            Pagamento #{result.id} registrado. Alocado: {numberToBRLString(result.allocatedAmount)} · Crédito:{' '}
            {numberToBRLString(result.creditAmount)}.
          </span>
        </FinancialState>
      )}
      <ConfirmDialog
        open={Boolean(confirmation)}
        title={account.isError ? 'Confirmar sem posição atual?' : 'Este pagamento gerará crédito'}
        confirmLabel='Confirmar pagamento'
        pending={mutation.isPending}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => confirmation && mutation.mutate(confirmation)}
      >
        {account.isError ? (
          <p>A posição da conta não pôde ser consultada. Confira cliente, data e valor antes de confirmar.</p>
        ) : (
          <p>
            Após o pagamento, o cliente ficará com{' '}
            <strong>{preview ? numberToBRLString(preview.creditAmount) : ''}</strong> de crédito. Confirme se o valor
            está correto.
          </p>
        )}
      </ConfirmDialog>
    </section>
  )
}
