import { getAccountSummary } from '@/services/account'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { allowMethod } from '@/utils/financialApiRoute'
import { parsePositiveId } from '@/utils/positiveId'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'GET')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  const id = parsePositiveId(req.query.id)
  if (!id) return res.status(400).json({ error: 'Invalid client ID' })
  try {
    const response = await getAccountSummary(id, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
