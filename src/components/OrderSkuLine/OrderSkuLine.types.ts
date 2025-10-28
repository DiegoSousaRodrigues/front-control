/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control } from 'react-hook-form'
import { OrderData } from '../FormOrder/FormOrder.types'

export type OrderSkuLineProps = {
  index: number
  control: Control<OrderData, any>
  removeProduct(index: number): () => void
  productId: number
  mockProducts: {
    value: number
    label: string
    price: string
  }[]
}
