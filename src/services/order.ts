import { ClientData } from '@/components/FormClient/FormClient.types'
import { OrderDetails } from '@/types/order'
import { apiControl } from '@/utils/api'

export async function findAll() {
  return await apiControl.get<OrderDetails[]>('order/list')
}

export async function create(body: OrderDetails) {
  return await apiControl.post('order', body)
}

export async function update(body: ClientData, id: string) {
  return await apiControl.put(`order/${id}`, body)
}

export async function findById(id?: string) {
  return await apiControl.get<OrderDetails>(`order/${id}`)
}

export async function changeStatus(id?: string, status?: string) {
  return await apiControl.post<OrderDetails>(`order/status/${id}/${status}`)
}
