import { create, update } from '@/services/client'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { parsePositiveId } from '@/utils/positiveId'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  if (req.method === 'POST') {
    try {
      const data = req.body
      const response = await create(data, token)
      return res.status(200).json(response.data)
    } catch (error) {
      return handleBackendError(error, res)
    }
  }

  if (req.method === 'PUT') {
    const clientId = parsePositiveId(req.query.id)
    if (!clientId) {
      return res.status(400).json({ error: 'Invalid client ID' })
    }

    try {
      const data = req.body
      const response = await update(data, clientId.toString(), token)
      return res.status(200).json(response.data)
    } catch (error) {
      return handleBackendError(error, res)
    }
  }

  res.setHeader('Allow', ['POST', 'PUT'])
  return res.status(405).json({ error: 'Method not allowed' })
}
