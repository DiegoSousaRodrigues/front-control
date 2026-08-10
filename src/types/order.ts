import { ClientDetails } from './client'

export type OrderProductRequest = {
  productId: number
  quantity: number
}

export type OrderRequest = {
  clientId: number
  orderYear: number
  orderMonth: number
  previousMonthPayment: number
  observation: string
  products: OrderProductRequest[]
}

export type OrderFormData = {
  clientId: string
  orderPeriod: string
  previousMonthPayment: string
  observation: string
  products: { productId: string; quantity: string }[]
}

export type OpenBalance = {
  balance: number
}

export type OrderSkuDetails = {
  id: number
  name: string
  salePrice: number
  active: boolean
  imageUrl?: string
}

export type OrderItemDetails = {
  id: number
  skuId: number
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  sku: OrderSkuDetails
}

export type OrderDetails = {
  id: number
  client: ClientDetails
  orderYear: number | null
  orderMonth: number | null
  openingBalance: number
  previousMonthPayment: number
  carriedBalance: number
  orderSkus: OrderItemDetails[]
  priceTotal: number
  amountDue: number
}
