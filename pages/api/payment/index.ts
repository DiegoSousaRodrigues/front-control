import { postPayment } from '@/services/payment'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import {
  allowMethod,
  hasJSONContentType,
  isSameOriginMutation,
  parsePaymentCreateBody,
} from '@/utils/financialApiRoute'
import { getTodayInSaoPaulo } from '@/utils/payment'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'POST')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  if (!isSameOriginMutation(req)) return res.status(403).json({ error: 'Invalid request origin' })
  if (!hasJSONContentType(req)) return res.status(415).json({ error: 'Content-Type must be application/json' })
  const body = parsePaymentCreateBody(req.body, getTodayInSaoPaulo())
  if (!body) return res.status(400).json({ error: 'Invalid payment' })
  try {
    const response = await postPayment(body, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}

export const config = { api: { bodyParser: { sizeLimit: '64kb' } } }
