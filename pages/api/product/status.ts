import { changeStatus } from '@/services/product'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = getRequestToken(req)
    if (rejectWithoutToken(res, token)) return
    const { id, status } = req.query

    try {
      const response = await changeStatus(id as string, status as string, token)
      res.status(200).json(response.data)
    } catch (error) {
      handleBackendError(error, res)
    }
  }
}
