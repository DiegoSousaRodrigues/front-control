import { ProductData } from '@/components/FormProduct/FormProduct.types'
import { ProductDetails } from '@/types/products'
import { apiControl } from '@/utils/api'

export async function findAll() {
  return await apiControl.get<ProductDetails[]>('sku/list')
}

export async function create(body: ProductData) {
  return await apiControl.post('sku', body)
}

export async function update(body: ProductDetails, id: string) {
  return await apiControl.put(`sku/${id}`, body)
}

export async function findById(id?: string) {
  return await apiControl.get<ProductDetails>(`sku/${id}`)
}

export async function changeStatus(id?: string, status?: string) {
  return await apiControl.post<ProductDetails>(`sku/status/${id}/${status}`)
}
