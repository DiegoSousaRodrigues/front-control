import { findClientBalance, findClientBalanceV2 } from '@/services/report'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { parsePositiveId } from '@/utils/positiveId'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { isBillingV2Enabled } from '@/utils/billingV2'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  const clientId = parsePositiveId(req.query.clientId)
  if (!clientId) return res.status(400).json({ error: 'Invalid client ID' })

  try {
    const response = isBillingV2Enabled()
      ? await findClientBalanceV2(clientId, token)
      : await findClientBalance(clientId, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
