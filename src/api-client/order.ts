import { OrderData } from '@/components/FormOrder/FormOrder.types'
import axios from 'axios'

export async function add(data: OrderData) {
  return await axios.post('/api/order', data)
}
