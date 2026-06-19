import { ClientData } from '@/components/FormClient/FormClient.types'
import { ClientDetails } from '@/types/client'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findAll(session?: string) {
  return await apiControl.get<ClientDetails[]>('client/list', {
    headers: getAuthHeader(session),
  })
}

export async function create(body: ClientData, session?: string) {
  return await apiControl.post('client', body, {
    headers: getAuthHeader(session),
  })
}

export async function update(body: ClientData, id: string, session?: string) {
  return await apiControl.put(`client/${id}`, body, {
    headers: getAuthHeader(session),
  })
}

export async function findById(id?: string, session?: string) {
  return await apiControl.get<ClientDetails>(`client/${id}`, {
    headers: getAuthHeader(session),
  })
}

export async function changeStatus(id?: string, status?: string, session?: string) {
  return await apiControl.post<ClientDetails>(`client/status/${id}/${status}`, undefined, {
    headers: getAuthHeader(session),
  })
}
