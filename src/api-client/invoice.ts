import {
  InvoiceCancelRequest,
  InvoiceDetail,
  InvoiceIssueRequest,
  InvoiceListFilters,
  InvoiceListResponse,
  InvoiceMutationResponse,
} from '@/types/invoice'
import axios from 'axios'

export async function issueInvoice(body: InvoiceIssueRequest) {
  return (await axios.post<InvoiceMutationResponse>('/api/invoice', body)).data
}
export async function listInvoices(filters: InvoiceListFilters) {
  return (await axios.get<InvoiceListResponse>('/api/invoice/list', { params: filters })).data
}
export async function findInvoice(id: number) {
  return (await axios.get<InvoiceDetail>('/api/invoice/detail', { params: { id } })).data
}
export async function cancelInvoice(id: number, body: InvoiceCancelRequest) {
  return (await axios.post<InvoiceMutationResponse>('/api/invoice/cancel', body, { params: { id } })).data
}
