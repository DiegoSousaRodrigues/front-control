import { ClientData } from '@/components/FormClient/FormClient.types'
import axios from 'axios'

export async function updateClientStatus(id: number, status: boolean) {
  await axios.post(
    `/api/client/status`,
    {},
    {
      params: {
        id,
        status: !status,
      },
    }
  )
}

export async function add(data: ClientData) {
  return await axios.post('/api/client', data)
}

export async function update(data: ClientData) {
  return await axios.put('/api/client', data)
}
