import { ClientDetails } from './client'
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
  orderSkus: OrderItemDetails[]
  priceTotal: number
}
