import { getAccountStatement } from '@/services/account'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { allowMethod, parseStatementQuery } from '@/utils/financialApiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'GET')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  const parsed = parseStatementQuery(req.query)
  if (!parsed) return res.status(400).json({ error: 'Invalid statement filters' })
  try {
    const response = await getAccountStatement(parsed.id, parsed.filters, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
