import { getPayments } from '@/services/payment'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { allowMethod, parsePaymentListQuery } from '@/utils/financialApiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'GET')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  const filters = parsePaymentListQuery(req.query)
  if (!filters) return res.status(400).json({ error: 'Invalid filters' })
  try {
    const response = await getPayments(filters, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
