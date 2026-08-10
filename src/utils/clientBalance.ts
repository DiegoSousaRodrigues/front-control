export type ClientBalanceViewState = 'initial' | 'loading' | 'error' | 'empty' | 'success'
export type ProfitStatus = 'unavailable' | 'positive' | 'negative' | 'zero'

export function buildClientBalanceQuery(
  currentQuery: Record<string, string | string[] | undefined>,
  clientId: number | null
) {
  const query = { ...currentQuery }
  if (clientId) query.clientId = String(clientId)
  else delete query.clientId
  return query
}

export function shouldFetchClientBalance(routerReady: boolean, clientId: number | null): boolean {
  return routerReady && clientId !== null
}

export function resolveClientBalanceViewState({
  clientId,
  isLoading,
  isError,
  monthCount,
}: {
  clientId: number | null
  isLoading: boolean
  isError: boolean
  monthCount?: number
}): ClientBalanceViewState {
  if (!clientId) return 'initial'
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (monthCount === 0) return 'empty'
  return 'success'
}

export function formatClientBalanceMonth(year: number | null, month: number | null): string {
  if (!year || !month || month < 1 || month > 12) return 'Sem competência (legado)'
  return `${String(month).padStart(2, '0')}/${year}`
}

export function getProfitStatus(value: number | null): ProfitStatus {
  if (value === null) return 'unavailable'
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'zero'
}

export function getProfitStatusLabel(status: ProfitStatus): string {
  return {
    unavailable: 'Indisponível',
    positive: 'Positivo',
    negative: 'Negativo',
    zero: 'Zero',
  }[status]
}

export function getMissingCostMessage(count: number): string {
  const safeCount = Number.isSafeInteger(count) && count > 0 ? count : 0
  return safeCount === 1
    ? '1 item não possui custo histórico confiável.'
    : `${safeCount} itens não possuem custo histórico confiável.`
}
