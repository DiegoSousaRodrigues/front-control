import type { AccountPosition } from './account'

export type PaymentStatus = 'posted' | 'reversed'

export type PaymentClient = {
  id: number
  name: string
  active: boolean
}

export type PaymentAllocation = {
  invoiceId: number
  amount: number
}

export type Payment = {
  id: number
  client: PaymentClient
  amount: number
  effectiveDate: string
  observation?: string | null
  status: PaymentStatus
  allocatedAmount: number
  creditAmount: number
  allocations: PaymentAllocation[]
  createdAt: string
  reversedAt?: string | null
  reversalReason?: string | null
}

export type PaymentMutationResponse = Payment & {
  account: AccountPosition
}

export type PaymentCreateRequest = {
  clientId: number
  amount: number
  effectiveDate: string
  observation?: string | null
}

export type PaymentReverseRequest = { reason: string }

export type PaymentListFilters = {
  clientId?: number
  dateFrom?: string
  dateTo?: string
  status?: PaymentStatus
  cursor?: string
  limit?: number
}

export type PaymentListResponse = {
  items: Payment[]
  nextCursor: string | null
}
