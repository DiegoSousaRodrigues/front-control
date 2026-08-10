export type ProductDetails = {
  id: number
  name: string
  purchasePrice: number | null
  salePrice: number
  active: boolean
  imageUrl?: string
}

export type ProductRequest = {
  name: string
  purchasePrice: number
  salePrice: number
}

export type ProductFormData = {
  name: string
  purchasePrice: string
  salePrice: string
  file?: File | string
}
