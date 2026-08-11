import { AccountPosition } from '@/types/account'
import { InvoiceFormData, InvoiceIssueRequest, InvoicePaymentStatus } from '@/types/invoice'
import { ProductDetails } from '@/types/products'
import { addCurrency } from './currency'
import { isFutureOrderPeriod, parseOrderMonth } from './orderMonth'

export function buildInvoiceRequest(data: InvoiceFormData): InvoiceIssueRequest | null {
  const period = parseOrderMonth(data.period)
  const clientId = Number(data.clientId)
  if (
    !period ||
    isFutureOrderPeriod(period) ||
    !Number.isSafeInteger(clientId) ||
    clientId <= 0 ||
    data.products.length === 0 ||
    data.products.length > 500 ||
    data.observation.trim().length > 1000
  )
    return null
  const products = data.products.map(({ productId, quantity }) => ({
    productId: Number(productId),
    quantity: Number(quantity),
  }))
  if (
    products.some(
      ({ productId, quantity }) =>
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0 ||
        quantity > 2_147_483_647
    )
  )
    return null
  if (new Set(products.map(({ productId }) => productId)).size !== products.length) return null
  return { clientId, year: period.year, month: period.month, observation: data.observation.trim() || null, products }
}

export function calculateInvoicePreview(position: AccountPosition, productsTotal: number): AccountPosition {
  const netBalance = addCurrency(position.netBalance, productsTotal)
  if (netBalance > 0) return { position: 'debt', netBalance, debtAmount: netBalance, creditAmount: 0 }
  if (netBalance < 0) return { position: 'credit', netBalance, debtAmount: 0, creditAmount: Math.abs(netBalance) }
  return { position: 'settled', netBalance: 0, debtAmount: 0, creditAmount: 0 }
}

export function getInvoicePaymentStatusLabel(status: InvoicePaymentStatus): string {
  return { open: 'Em aberto', partially_paid: 'Pago parcialmente', paid: 'Pago', canceled: 'Cancelada' }[status]
}

export function activeInvoiceProductOptions(products: ProductDetails[]) {
  return products
    .filter(({ active }) => active)
    .map(({ id, name, salePrice }) => ({ value: String(id), label: name, salePrice }))
}
