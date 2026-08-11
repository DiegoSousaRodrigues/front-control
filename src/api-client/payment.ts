import {
  PaymentCreateRequest,
  PaymentListFilters,
  PaymentListResponse,
  PaymentMutationResponse,
  PaymentReverseRequest,
  Payment,
} from '@/types/payment'
import axios from 'axios'

export async function createPayment(body: PaymentCreateRequest) {
  return (await axios.post<PaymentMutationResponse>('/api/payment', body)).data
}

export async function listPayments(filters: PaymentListFilters) {
  return (await axios.get<PaymentListResponse>('/api/payment/list', { params: filters })).data
}

export async function findPayment(id: number) {
  return (await axios.get<Payment>('/api/payment/detail', { params: { id } })).data
}

export async function reversePayment(id: number, body: PaymentReverseRequest) {
  return (await axios.post<PaymentMutationResponse>('/api/payment/reverse', body, { params: { id } })).data
}
