import { AccountStatementFilters, AccountStatementResponse, AccountSummary } from '@/types/account'
import axios from 'axios'

export async function findAccountSummary(clientId: number) {
  return (await axios.get<AccountSummary>('/api/client/account', { params: { id: clientId } })).data
}

export async function findAccountStatement(clientId: number, filters: AccountStatementFilters = {}) {
  return (
    await axios.get<AccountStatementResponse>('/api/client/account/statement', {
      params: { id: clientId, ...filters },
    })
  ).data
}
