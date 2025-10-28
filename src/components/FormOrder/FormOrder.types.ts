export type OrderData = {
  clientId: number
  observation: string
  productId: number
  products: Product[]
}

export type Product = {
  productId: number
  quantity: number
}
