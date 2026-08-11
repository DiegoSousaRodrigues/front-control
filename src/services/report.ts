import { ClientBalance, ClientBalanceV2 } from '@/types/report'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findClientBalance(clientId: number, session?: string) {
  return await apiControl.get<ClientBalance>('report/client-balance', {
    headers: getAuthHeader(session),
    params: { clientId },
  })
}

export async function findClientBalanceV2(clientId: number, session?: string) {
  return await apiControl.get<ClientBalanceV2>('report/client-balance', {
    headers: getAuthHeader(session),
    params: { clientId },
  })
}
