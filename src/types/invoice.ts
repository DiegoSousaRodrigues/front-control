import type { AccountPosition } from './account'
import type { PaymentClient } from './payment'

export type InvoiceLifecycleStatus = 'issued' | 'canceled'
export type InvoicePaymentStatus = 'open' | 'partially_paid' | 'paid' | 'canceled'

export type InvoiceProductRequest = { productId: number; quantity: number }
export type InvoiceIssueRequest = {
  clientId: number
  year: number
  month: number
  observation: string | null
  products: InvoiceProductRequest[]
}
export type InvoiceFormData = {
  clientId: string
  period: string
  observation: string
  products: { productId: string; quantity: string }[]
}
export type InvoicePeriod = { year: number; month: number }
export type InvoiceSummary = {
  id: number
  status: InvoiceLifecycleStatus
  period: InvoicePeriod
  client: PaymentClient
  productsTotal: number
  accountBalanceBeforeIssue: number
  accountBalanceAfterCharge: number
  paidAmount: number
  openAmount: number
  paymentStatus: InvoicePaymentStatus
  observation?: string | null
  createdAt: string
  canceledAt?: string | null
  cancellationReason?: string | null
}
export type InvoiceItem = {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPurchasePrice: number
  unitSalePrice: number
  purchaseTotal: number
  saleTotal: number
  profitTotal: number
}
export type InvoiceDetail = InvoiceSummary & { items: InvoiceItem[] }
export type InvoiceMutationResponse = { invoice: InvoiceDetail; account: AccountPosition }
export type InvoiceListFilters = { year: number; month: number; clientId?: number; cursor?: string; limit?: number }
export type InvoiceListResponse = { items: InvoiceSummary[]; nextCursor: string | null }
export type InvoiceCancelRequest = { reason: string }
