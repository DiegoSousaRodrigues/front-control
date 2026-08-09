import type { ClientData } from '@/components/FormClient/FormClient.types'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { update } from './client'

vi.mock('axios', () => ({
  default: {
    put: vi.fn(),
  },
}))

describe('client API client update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([1, 2])('sends client ID %s to the BFF', async (id) => {
    const data = { id, name: `Client ${id}` } as ClientData
    vi.mocked(axios.put).mockResolvedValue({ status: 200 })

    await update(id, data)

    expect(axios.put).toHaveBeenCalledWith('/api/client', data, {
      params: { id },
    })
  })

  it('does not call the BFF with an invalid ID', async () => {
    const data = { id: 0 } as ClientData

    await expect(update(0, data)).rejects.toThrow('Invalid client ID')
    expect(axios.put).not.toHaveBeenCalled()
  })
})
