/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control } from 'react-hook-form'
import { OrderData } from '../FormOrder/FormOrder.types'
import { OrderProductOption } from '@/utils/orderTotals'

export type OrderSkuLineProps = {
  index: number
  control: Control<OrderData, any>
  removeProduct(index: number): () => void
  products: OrderProductOption[]
}
