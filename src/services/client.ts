import { ClientData } from '@/components/FormClient/FormClient.types'
import { apiControl } from '@/utils/api'

export async function FindAll() {
  return await apiControl.get('client/list')
}

export async function Create(body: ClientData) {
  return await apiControl.post('client', body)
}
