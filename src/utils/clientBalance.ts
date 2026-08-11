import { ClientBalance, ClientBalanceContract, ClientBalanceV2 } from '@/types/report'

export type ClientBalanceViewState = 'initial' | 'loading' | 'error' | 'empty' | 'success'
export type ProfitStatus = 'unavailable' | 'positive' | 'negative' | 'zero'

export type ClientBalancePresentationMonth = {
  year: number | null
  month: number | null
  recordCount: number
  quantityTotal: number
  purchaseTotal: number | null
  saleTotal: number
  profitTotal: number | null
  costComplete: boolean
}

export type ClientBalancePresentation = {
  client: ClientBalanceContract['client']
  totals: Omit<ClientBalancePresentationMonth, 'year' | 'month'> & { missingCostItemCount: number }
  months: ClientBalancePresentationMonth[]
  recordLabel: 'Pedidos' | 'Faturas'
  isV2: boolean
}

export function toClientBalancePresentation(
  report: ClientBalanceContract,
  billingV2Enabled: boolean
): ClientBalancePresentation {
  if (billingV2Enabled) {
    const v2Report = report as ClientBalanceV2
    return {
      client: v2Report.client,
      totals: {
        recordCount: v2Report.totals.invoiceCount,
        quantityTotal: v2Report.totals.quantityTotal,
        purchaseTotal: v2Report.totals.purchaseTotal,
        saleTotal: v2Report.totals.saleTotal,
        profitTotal: v2Report.totals.profitTotal,
        costComplete: true,
        missingCostItemCount: 0,
      },
      months: v2Report.months.map((month) => ({
        year: month.year,
        month: month.month,
        recordCount: month.invoiceCount,
        quantityTotal: month.quantityTotal,
        purchaseTotal: month.purchaseTotal,
        saleTotal: month.saleTotal,
        profitTotal: month.profitTotal,
        costComplete: true,
      })),
      recordLabel: 'Faturas',
      isV2: true,
    }
  }

  const legacyReport = report as ClientBalance
  return {
    client: legacyReport.client,
    totals: {
      recordCount: legacyReport.totals.orderCount,
      quantityTotal: legacyReport.totals.quantityTotal,
      purchaseTotal: legacyReport.totals.purchaseTotal,
      saleTotal: legacyReport.totals.saleTotal,
      profitTotal: legacyReport.totals.profitTotal,
      costComplete: legacyReport.totals.costComplete,
      missingCostItemCount: legacyReport.totals.missingCostItemCount,
    },
    months: legacyReport.months.map((month) => ({
      year: month.year,
      month: month.month,
      recordCount: month.orderCount,
      quantityTotal: month.quantityTotal,
      purchaseTotal: month.purchaseTotal,
      saleTotal: month.saleTotal,
      profitTotal: month.profitTotal,
      costComplete: month.costComplete,
    })),
    recordLabel: 'Pedidos',
    isV2: false,
  }
}

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
