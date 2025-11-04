import { ProductData } from '@/components/FormProduct/FormProduct.types'
import axios from 'axios'

export async function updateProductStatus(id: number, status: boolean) {
  await axios.post(
    `/api/product/status`,
    {},
    {
      params: {
        id,
        status: !status,
      },
    }
  )
}

export async function add(data: ProductData) {
  return await axios.post('/api/product', data)
}

export async function update(data: ProductData) {
  return await axios.put('/api/product', data)
}
