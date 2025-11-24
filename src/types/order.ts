import { ClientDetails } from './client'

export type OrderDetails = {
  id: number
  client: ClientDetails
  priceTotal: string
}
