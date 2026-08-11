import {
  InvoiceCancelRequest,
  InvoiceDetail,
  InvoiceIssueRequest,
  InvoiceListFilters,
  InvoiceListResponse,
  InvoiceMutationResponse,
} from '@/types/invoice'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export function postInvoice(body: InvoiceIssueRequest, session?: string) {
  return apiControl.post<InvoiceMutationResponse>('invoice', body, { headers: getAuthHeader(session) })
}
export function getInvoices(filters: InvoiceListFilters, session?: string) {
  return apiControl.get<InvoiceListResponse>('invoice/list', { headers: getAuthHeader(session), params: filters })
}
export function getInvoice(id: number, session?: string) {
  return apiControl.get<InvoiceDetail>(`invoice/${id}`, { headers: getAuthHeader(session) })
}
export function postInvoiceCancellation(id: number, body: InvoiceCancelRequest, session?: string) {
  return apiControl.post<InvoiceMutationResponse>(`invoice/${id}/cancel`, body, { headers: getAuthHeader(session) })
}
