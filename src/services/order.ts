import { ClientData } from '@/components/FormClient/FormClient.types'
import { OrderDetails } from '@/types/order'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findAll(session?: string) {
  return await apiControl.get<OrderDetails[]>('order/list', {
    headers: getAuthHeader(session),
  })
}

export async function create(body: OrderDetails, session?: string) {
  return await apiControl.post('order', body, {
    headers: getAuthHeader(session),
  })
}

export async function update(body: ClientData, id: string, session?: string) {
  return await apiControl.put(`order/${id}`, body, {
    headers: getAuthHeader(session),
  })
}

export async function findById(id?: string, session?: string) {
  return await apiControl.get<OrderDetails>(`order/${id}`, {
    headers: getAuthHeader(session),
  })
}

export async function changeStatus(id?: string, status?: string, session?: string) {
  return await apiControl.post<OrderDetails>(`order/status/${id}/${status}`, undefined, {
    headers: getAuthHeader(session),
  })
}
