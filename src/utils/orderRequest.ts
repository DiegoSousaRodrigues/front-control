import { OrderFormData, OrderRequest } from '@/types/order'
import { BRLStringToNumber } from './currency'
import { isFutureOrderPeriod, parseOrderMonth } from './orderMonth'

export function createOrderResetValues(clientId: string, orderPeriod: string): OrderFormData {
  return {
    clientId,
    orderPeriod,
    previousMonthPayment: clientId ? 'R$ 0,00' : '',
    observation: '',
    products: [],
  }
}

export function createOrderRequest(data: OrderFormData, balance: number): OrderRequest | null {
  const period = parseOrderMonth(data.orderPeriod)
  const clientId = Number(data.clientId)
  const previousMonthPayment = BRLStringToNumber(data.previousMonthPayment)
  const products = data.products.map(({ productId, quantity }) => ({
    productId: Number(productId),
    quantity: Number(quantity),
  }))

  if (
    !period ||
    isFutureOrderPeriod(period) ||
    !Number.isSafeInteger(clientId) ||
    clientId <= 0 ||
    !Number.isFinite(previousMonthPayment) ||
    previousMonthPayment < 0 ||
    previousMonthPayment > balance ||
    products.some(
      ({ productId, quantity }) =>
        !Number.isSafeInteger(productId) || productId <= 0 || !Number.isSafeInteger(quantity) || quantity <= 0
    )
  ) {
    return null
  }

  return {
    clientId,
    orderYear: period.year,
    orderMonth: period.month,
    previousMonthPayment,
    observation: data.observation,
    products,
  }
}
