import { ClientDetails } from './client'
import { ProductDetails } from './products'

export type OrderItemDetails = {
  id: number
  skuId: number
  name: string
  quantity: number
  unitPrice: string
  lineTotal: string
  sku: ProductDetails
}

export type OrderDetails = {
  id: number
  client: ClientDetails
  orderSkus: OrderItemDetails[]
  priceTotal: string
}
