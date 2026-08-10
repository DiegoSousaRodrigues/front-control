import { OpenBalance, OrderDetails, OrderRequest } from '@/types/order'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findAll(year: number, month: number, session?: string) {
  return await apiControl.get<OrderDetails[]>('order/list', {
    headers: getAuthHeader(session),
    params: { year, month },
  })
}

export async function findOpenBalance(clientId: number, year: number, month: number, session?: string) {
  return await apiControl.get<OpenBalance>('order/open-balance', {
    headers: getAuthHeader(session),
    params: { clientId, year, month },
  })
}

export async function create(body: OrderRequest, session?: string) {
  return await apiControl.post('order', body, { headers: getAuthHeader(session) })
}

export async function findById(id?: string, session?: string) {
  return await apiControl.get<OrderDetails>(`order/${id}`, { headers: getAuthHeader(session) })
}
