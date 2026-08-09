import { ClientData } from '@/components/FormClient/FormClient.types'
import { parsePositiveId } from '@/utils/positiveId'
import axios from 'axios'

export async function listAll() {
  return await axios.get('/api/client/list')
}

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

export async function update(id: number, data: ClientData) {
  const clientId = parsePositiveId(id)
  if (!clientId) throw new Error('Invalid client ID')

  return await axios.put('/api/client', data, {
    params: { id: clientId },
  })
}
