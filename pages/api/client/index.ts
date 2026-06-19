import { create, update } from '@/services/client'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  if (req.method === 'POST') {
    try {
      const data = req.body
      const response = await create(data, token)
      res.status(200).json(response.data)
    } catch (error) {
      handleBackendError(error, res)
    }
  }
  if (req.method === 'PUT') {
    try {
      const data = req.body
      const response = await update(data, '1', token)
      res.status(200).json(response.data)
    } catch (error) {
      handleBackendError(error, res)
    }
  }
}
