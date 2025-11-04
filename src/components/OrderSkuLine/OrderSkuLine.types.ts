/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, UseFormGetValues } from 'react-hook-form'
import { OrderData } from '../FormOrder/FormOrder.types'

export type OrderSkuLineProps = {
  index: number
  control: Control<OrderData, any>
  removeProduct(index: number): () => void
  getValues: UseFormGetValues<OrderData>
  products: {
    value: number
    label: string
    price: string
  }[]
}
