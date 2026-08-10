import { findOpenBalance } from '@/services/order'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { isFutureOrderPeriod, parseOrderPeriod } from '@/utils/orderMonth'
import { parsePositiveId } from '@/utils/positiveId'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  const clientId = parsePositiveId(req.query.clientId)
  const period = parseOrderPeriod(req.query.year, req.query.month)
  if (!clientId || !period || isFutureOrderPeriod(period)) {
    return res.status(400).json({ error: 'Invalid open balance parameters' })
  }

  try {
    const response = await findOpenBalance(clientId, period.year, period.month, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
