import { postInvoice } from '@/services/invoice'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { allowMethod, hasJSONContentType, isSameOriginMutation } from '@/utils/financialApiRoute'
import { hasEmptyInvoiceQuery, parseInvoiceIssueBody } from '@/utils/invoiceApiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'POST')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  if (!isSameOriginMutation(req)) return res.status(403).json({ error: 'Invalid request origin' })
  if (!hasJSONContentType(req)) return res.status(415).json({ error: 'Content-Type must be application/json' })
  if (!hasEmptyInvoiceQuery(req.query)) return res.status(400).json({ error: 'Invalid invoice query' })
  const body = parseInvoiceIssueBody(req.body)
  if (!body) return res.status(400).json({ error: 'Invalid invoice' })
  try {
    const response = await postInvoice(body, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
export const config = { api: { bodyParser: { sizeLimit: '64kb' } } }
