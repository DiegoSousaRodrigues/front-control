import { ProductDetails, ProductFormData, ProductRequest } from '@/types/products'
import { numberToBRLString } from './currency'

export function productDetailsToFormData(product: ProductDetails): ProductFormData {
  return {
    name: product.name,
    purchasePrice: product.purchasePrice === null ? '' : numberToBRLString(product.purchasePrice),
    salePrice: numberToBRLString(product.salePrice),
    file: product.imageUrl,
  }
}

export function createProductFormData(product: ProductRequest, file?: File | string): FormData {
  const formData = new FormData()
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }))

  if (file instanceof File) {
    formData.append('file', file)
  }

  return formData
}
