export type ReportClient = {
  id: number
  name: string
  active: boolean
}

export type ClientBalanceTotals = {
  orderCount: number
  quantityTotal: number
  purchaseTotal: number | null
  saleTotal: number
  profitTotal: number | null
  costComplete: boolean
  missingCostItemCount: number
}

export type ClientBalanceMonth = ClientBalanceTotals & {
  year: number | null
  month: number | null
}

export type ClientBalance = {
  client: ReportClient
  totals: ClientBalanceTotals
  months: ClientBalanceMonth[]
}
