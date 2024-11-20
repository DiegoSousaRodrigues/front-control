import { ClientData } from '@/components/FormClient/FormClient.types'
import { ClientDetails } from '@/types/client'
import { apiControl } from '@/utils/api'

export async function findAll() {
  return await apiControl.get<ClientDetails[]>('client/list')
}

export async function create(body: ClientData) {
  return await apiControl.post('client', body)
}

export async function update(body: ClientData, id: string) {
  return await apiControl.put(`client/${id}`, body)
}

export async function findById(id?: string) {
  return await apiControl.get<ClientDetails>(`client/${id}`)
}

export async function changeStatus(id?: string, status?: string) {
  return await apiControl.post<ClientDetails>(`client/status/${id}/${status}`)
}
