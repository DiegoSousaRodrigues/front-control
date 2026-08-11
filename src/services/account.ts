import { AccountStatementFilters, AccountStatementResponse, AccountSummary } from '@/types/account'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export function getAccountSummary(clientId: number, session?: string) {
  return apiControl.get<AccountSummary>(`client/${clientId}/account`, { headers: getAuthHeader(session) })
}

export function getAccountStatement(clientId: number, filters: AccountStatementFilters, session?: string) {
  return apiControl.get<AccountStatementResponse>(`client/${clientId}/account/statement`, {
    headers: getAuthHeader(session),
    params: filters,
  })
}
