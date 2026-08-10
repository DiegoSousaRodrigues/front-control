import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Input } from '../lib/Input/Input'
import Select from '../lib/Select'
import {
  AddButton,
  BalanceCard,
  BalanceLabel,
  BalanceState,
  BalanceSuccess,
  BalanceValue,
  ButtonsRow,
  Field,
  FieldsRow,
  Form,
  ItemsSection,
  FinancialSegment,
  PaymentSegment,
  Receivable,
  SummaryHint,
  SummaryLabel,
  SummaryValue,
  SubmitButton,
  Title,
  Wrapper,
} from './FormOrder.styles'
import { FormOrderProps, OrderData } from './FormOrder.types'
import OrderSkuLine from '../OrderSkuLine'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryFetch } from '@/utils/queryFetch'
import { ClientDetails } from '@/types/client'
import { ProductDetails } from '@/types/products'
import Message from '../lib/Message'
import { add } from '@/api-client/order'
import { showToastEvent } from '@/events/events'
import { useEffect, useMemo, useState } from 'react'
import { OpenBalance } from '@/types/order'
import {
  formatOrderPeriod,
  getCurrentOrderMonth,
  getPreviousOrderPeriod,
  isFutureOrderPeriod,
  parseOrderMonth,
} from '@/utils/orderMonth'
import { addCurrency, BRLStringToNumber, numberToBRLString, subtractCurrency } from '@/utils/currency'
import { createOrderRequest, createOrderResetValues } from '@/utils/orderRequest'
import { calculateCurrentOrderTotal } from '@/utils/orderTotals'

const ZERO_BRL = 'R$ 0,00'

export function FormOrder({ isSequence = false }: FormOrderProps) {
  const currentMonth = getCurrentOrderMonth()
  const { control, register, handleSubmit, formState, setError, reset, setValue, watch } =
    useForm<OrderData>({
      defaultValues: {
        clientId: '',
        orderPeriod: currentMonth,
        previousMonthPayment: '',
        observation: '',
        products: [],
      },
    })
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'products' })
  const [clientIndex, setClientIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const clientId = watch('clientId')
  const orderPeriodValue = watch('orderPeriod')
  const previousMonthPaymentValue = watch('previousMonthPayment')
  const selectedProducts = useWatch({ control, name: 'products' })
  const orderPeriod = parseOrderMonth(orderPeriodValue)
  const numericClientId = Number(clientId)

  const clientsQuery = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const productsQuery = useQuery({
    queryKey: ['product/list'],
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
  })
  const balanceQuery = useQuery({
    queryKey: [
      'order/open-balance',
      { clientId: numericClientId, year: orderPeriod?.year, month: orderPeriod?.month },
    ],
    queryFn: queryFetch<OpenBalance>,
    enabled:
      Number.isSafeInteger(numericClientId) &&
      numericClientId > 0 &&
      Boolean(orderPeriod && !isFutureOrderPeriod(orderPeriod)),
    refetchOnWindowFocus: false,
  })

  const listClients = useMemo(
    () =>
      clientsQuery.data?.map((client) => ({
        value: client.id,
        label: `${client.name} - ${client.street}, ${client.number}`,
      })),
    [clientsQuery.data]
  )
  const listProduct = useMemo(
    () =>
      productsQuery.data?.map((product) => ({
        value: String(product.id),
        label: product.name,
        salePrice: product.salePrice,
      })),
    [productsQuery.data]
  )

  const currentOrderTotal = calculateCurrentOrderTotal(selectedProducts || [], listProduct || [])
  const balance = balanceQuery.data?.balance ?? 0
  const parsedPayment = BRLStringToNumber(previousMonthPaymentValue)
  const payment = Number.isFinite(parsedPayment) ? parsedPayment : 0
  const residual = subtractCurrency(balance, payment)
  const amountDue = addCurrency(residual, currentOrderTotal)
  const previousPeriod = orderPeriod ? getPreviousOrderPeriod(orderPeriod) : null
  const buttonText = isSequence && fields.length === 0 ? 'Passar para o próximo cliente' : 'Cadastrar pedido'

  useEffect(() => {
    if (!isSequence) return
    if (!listClients?.length) {
      setValue('clientId', '')
      return
    }
    const boundedIndex = Math.min(clientIndex, listClients.length - 1)
    setValue('clientId', listClients[boundedIndex].value.toString())
  }, [clientIndex, isSequence, listClients, setValue])

  useEffect(() => {
    setValue('previousMonthPayment', clientId ? ZERO_BRL : '')
  }, [clientId, orderPeriodValue, setValue])

  function resetForClient(nextClientId: string) {
    reset(createOrderResetValues(nextClientId, orderPeriodValue))
    replace([])
  }

  function advanceSequenceClient() {
    if (!isSequence || !listClients?.length) return
    const nextIndex = clientIndex + 1
    if (nextIndex >= listClients.length) {
      showToastEvent({ status: 'success', description: 'Fila de clientes concluída' })
      resetForClient(listClients[0].value.toString())
      setClientIndex(0)
      return
    }
    resetForClient(listClients[nextIndex].value.toString())
    setClientIndex(nextIndex)
  }

  async function onSubmit(data: OrderData) {
    if (!data.products.length) {
      if (isSequence) return advanceSequenceClient()
      setError('products', { type: 'required', message: 'Adicione ao menos um produto' })
      return
    }
    const request = createOrderRequest(data, balance)
    if (!request) {
      setError('previousMonthPayment', { type: 'validate', message: 'Informe um pagamento entre zero e o saldo' })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await add(request)
      if (response.status === 200 || response.status === 201) {
        showToastEvent({ status: 'success', description: 'Pedido cadastrado com sucesso' })
        await queryClient.invalidateQueries({ queryKey: ['order/list'] })
        if (isSequence) {
          await queryClient.invalidateQueries({ queryKey: ['order/open-balance'] })
          advanceSequenceClient()
        } else {
          resetForClient('')
          await queryClient.invalidateQueries({ queryKey: ['order/open-balance'] })
        }
      }
    } catch {
      showToastEvent({ status: 'error', description: 'Erro ao salvar pedido. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (clientsQuery.isLoading || productsQuery.isLoading) return <>Carregando...</>
  if (clientsQuery.isError || productsQuery.isError) return <>Erro ao carregar dados do pedido. Tente novamente.</>

  return (
    <Wrapper>
      <Title>Cadastrar pedido</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldsRow>
          <Field>
            <Controller
              control={control}
              name='clientId'
              rules={{ required: 'Campo obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <Select label='Selecione um cliente' items={listClients || []} value={value} onChange={onChange} />
              )}
            />
            {formState.errors.clientId && <Message>{formState.errors.clientId.message}</Message>}
          </Field>
          <Field>
            <Input
              type='month'
              label='Mês do pedido'
              max={currentMonth}
              {...register('orderPeriod', {
                required: 'Mês do pedido é obrigatório',
                validate: (value) => {
                  const period = parseOrderMonth(value)
                  return (period && !isFutureOrderPeriod(period)) || 'Selecione o mês atual ou um mês anterior'
                },
              })}
            />
            {formState.errors.orderPeriod && <Message>{formState.errors.orderPeriod.message}</Message>}
          </Field>
          <Field>
            <Input label='Observação sobre o pedido' {...register('observation')} />
          </Field>
        </FieldsRow>

        <BalanceCard aria-live='polite' aria-label='Resumo financeiro do pedido'>
          {!clientId || !orderPeriod ? (
            <BalanceState>
              <span>Selecione cliente e mês para consultar o saldo acumulado.</span>
            </BalanceState>
          ) : balanceQuery.isLoading || balanceQuery.isFetching ? (
            <BalanceState>
              <span>Consultando saldo acumulado...</span>
              <span className='h-4 w-4 animate-pulse rounded-full bg-gray-300' aria-hidden='true' />
            </BalanceState>
          ) : balanceQuery.isError ? (
            <BalanceState>
              <span>Não foi possível consultar o saldo.</span>
              <button type='button' className='font-medium text-primary underline' onClick={() => balanceQuery.refetch()}>
                Tentar novamente
              </button>
            </BalanceState>
          ) : (
            <>
              <BalanceSuccess>
                <FinancialSegment>
                  <BalanceLabel>
                    Saldo acumulado até{' '}
                    {previousPeriod ? formatOrderPeriod(previousPeriod.year, previousPeriod.month) : 'o mês anterior'}
                  </BalanceLabel>
                  <BalanceValue>{numberToBRLString(balance)}</BalanceValue>
                  {balance === 0 && <SummaryHint>Cliente sem saldo em aberto.</SummaryHint>}
                </FinancialSegment>
                <PaymentSegment>
                  <Input
                    label={`Valor pago no mês anterior${
                      previousPeriod ? ` (${formatOrderPeriod(previousPeriod.year, previousPeriod.month)})` : ''
                    }`}
                    mask='currency'
                    inputMode='decimal'
                    {...register('previousMonthPayment', {
                      required: 'Informe o valor pago',
                      validate: (value) => {
                        const paid = BRLStringToNumber(value)
                        return (
                          (Number.isFinite(paid) && paid >= 0 && paid <= balance) ||
                          'O pagamento deve estar entre zero e o saldo'
                        )
                      },
                    })}
                  />
                  {formState.errors.previousMonthPayment && (
                    <Message>{formState.errors.previousMonthPayment.message}</Message>
                  )}
                </PaymentSegment>
                <FinancialSegment>
                  <SummaryLabel>Saldo residual</SummaryLabel>
                  <SummaryValue>{numberToBRLString(residual)}</SummaryValue>
                </FinancialSegment>
                <Receivable>
                  <SummaryLabel>Total a receber</SummaryLabel>
                  <SummaryValue>{numberToBRLString(amountDue)}</SummaryValue>
                  <SummaryHint>Pedido atual: {numberToBRLString(currentOrderTotal)}</SummaryHint>
                </Receivable>
              </BalanceSuccess>
            </>
          )}
        </BalanceCard>

        <ItemsSection>
          {fields.map(({ id }, index) => (
            <OrderSkuLine
              key={id}
              index={index}
              control={control}
              removeProduct={(target) => () => remove(target)}
              products={listProduct || []}
            />
          ))}
          {formState.errors.products && <Message>{formState.errors.products.message}</Message>}
        </ItemsSection>

        <ButtonsRow>
          <AddButton
            type='button'
            onClick={() => append({ productId: '', quantity: '1' })}
          >
            Adicionar mais produtos
          </AddButton>
          <SubmitButton disabled={isSubmitting || !balanceQuery.isSuccess}>
            {isSubmitting ? 'Salvando...' : buttonText}
          </SubmitButton>
        </ButtonsRow>
      </Form>
    </Wrapper>
  )
}
