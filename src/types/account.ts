import type { PaymentClient } from './payment'

export type AccountPositionState = 'debt' | 'settled' | 'credit'

export type AccountPosition = {
  position: AccountPositionState
  netBalance: number
  debtAmount: number
  creditAmount: number
}

export type AccountSummary = AccountPosition & {
  client: PaymentClient
  openInvoiceCount: number
  asOf: string
}

export type AccountStatementEventType = 'invoice_issued' | 'invoice_canceled' | 'payment_posted' | 'payment_reversed'

export type AccountStatementItem = {
  eventId: string
  type: AccountStatementEventType
  effectiveDate: string
  recordedAt: string
  invoiceId: number | null
  paymentId: number | null
  description: string
  debit: number
  credit: number
  balanceAfterEvent: number
}

export type AccountStatementResponse = {
  items: AccountStatementItem[]
  nextCursor: string | null
  snapshotRecordedAt: string
}

export type AccountStatementFilters = {
  cursor?: string
  limit?: number
  dateTo?: string
}
