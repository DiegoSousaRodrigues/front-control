export type FormOrderProps = {
  isSequence?: boolean
}

export type OrderData = {
  clientId: string
  observation: string
  productId: number
  products: Product[]
}

export type Product = {
  productId: number
  quantity: number
}
