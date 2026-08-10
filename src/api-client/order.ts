import { OrderRequest } from '@/types/order'
import axios from 'axios'

export async function add(data: OrderRequest) {
  return await axios.post('/api/order', data)
}
