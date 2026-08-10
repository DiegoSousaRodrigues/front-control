import axios from 'axios'
import { expect, it, vi } from 'vitest'
import { add } from './order'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))

it('posts the numeric order request to the BFF', async () => {
  const request = {
    clientId: 1,
    orderYear: 2026,
    orderMonth: 8,
    previousMonthPayment: 10,
    observation: '',
    products: [{ productId: 2, quantity: 3 }],
  }
  vi.mocked(axios.post).mockResolvedValue({ status: 201 })
  await add(request)
  expect(axios.post).toHaveBeenCalledWith('/api/order', request)
})
