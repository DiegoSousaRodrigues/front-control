import { ClientBalance } from '@/types/report'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findClientBalance(clientId: number, session?: string) {
  return await apiControl.get<ClientBalance>('report/client-balance', {
    headers: getAuthHeader(session),
    params: { clientId },
  })
}
