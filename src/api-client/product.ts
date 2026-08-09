import { parsePositiveId } from '@/utils/positiveId'
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

export async function add(data: FormData) {
  return await axios.post('/api/product', data)
}

export async function update(id: number, data: FormData) {
  const productId = parsePositiveId(id)
  if (!productId) throw new Error('Invalid product ID')

  return await axios.put('/api/product', data, {
    params: { id: productId },
  })
}
