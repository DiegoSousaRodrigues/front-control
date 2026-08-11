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

export type ClientBalanceV2Totals = {
  invoiceCount: number
  quantityTotal: number
  purchaseTotal: number
  saleTotal: number
  profitTotal: number
}

export type ClientBalanceV2Month = ClientBalanceV2Totals & {
  year: number
  month: number
}

export type ClientBalanceV2 = {
  client: ReportClient
  totals: ClientBalanceV2Totals
  months: ClientBalanceV2Month[]
}

export type ClientBalanceContract = ClientBalance | ClientBalanceV2
