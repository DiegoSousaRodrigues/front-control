import { ProductDetails } from '@/types/products'
import { apiControl } from '@/utils/api'
import { getAuthHeader } from '@/utils/auth'

export async function findAll(session?: string) {
  return await apiControl.get<ProductDetails[]>('sku/list', {
    headers: getAuthHeader(session),
  })
}

export async function create(body: FormData, session?: string) {
  return await apiControl.post('sku', body, {
    headers: getAuthHeader(session),
  })
}

export async function update(body: ProductDetails, id: string, contentType?: string, session?: string) {
  return await apiControl.put(`sku/${id}`, body, {
    headers: { ...getAuthHeader(session), ...(contentType ? { 'Content-Type': contentType } : {}) },
  })
}

export async function findById(id?: string, session?: string) {
  return await apiControl.get<ProductDetails>(`sku/${id}`, {
    headers: getAuthHeader(session),
  })
}

export async function changeStatus(id?: string, status?: string, session?: string) {
  return await apiControl.post<ProductDetails>(`sku/status/${id}/${status}`, undefined, {
    headers: getAuthHeader(session),
  })
}
