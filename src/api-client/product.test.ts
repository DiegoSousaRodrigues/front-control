import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { update } from './product'

vi.mock('axios', () => ({
  default: {
    put: vi.fn(),
  },
}))

describe('product API client update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([1, 2])('sends product ID %s to the BFF', async (id) => {
    const data = new FormData()
    data.append('name', `Product ${id}`)
    vi.mocked(axios.put).mockResolvedValue({ status: 200 })

    await update(id, data)

    expect(axios.put).toHaveBeenCalledWith('/api/product', data, {
      params: { id },
    })
  })

  it('does not call the BFF with an invalid ID', async () => {
    const data = new FormData()

    await expect(update(0, data)).rejects.toThrow('Invalid product ID')
    expect(axios.put).not.toHaveBeenCalled()
  })
})
