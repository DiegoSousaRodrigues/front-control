import {
  Payment,
  PaymentCreateRequest,
  PaymentListFilters,
  PaymentListResponse,
  PaymentMutationResponse,
  PaymentReverseRequest,
} from '@/types/payment'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export function postPayment(body: PaymentCreateRequest, session?: string) {
  return apiControl.post<PaymentMutationResponse>('payment', body, { headers: getAuthHeader(session) })
}

export function getPayments(filters: PaymentListFilters, session?: string) {
  return apiControl.get<PaymentListResponse>('payment/list', { headers: getAuthHeader(session), params: filters })
}

export function getPayment(id: number, session?: string) {
  return apiControl.get<Payment>(`payment/${id}`, { headers: getAuthHeader(session) })
}

export function postPaymentReversal(id: number, body: PaymentReverseRequest, session?: string) {
  return apiControl.post<PaymentMutationResponse>(`payment/${id}/reverse`, body, { headers: getAuthHeader(session) })
}
