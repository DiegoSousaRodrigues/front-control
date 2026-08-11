import { getInvoice } from '@/services/invoice'
import { handleBackendError, rejectWithoutToken } from '@/utils/apiRoute'
import { allowMethod } from '@/utils/financialApiRoute'
import { parseInvoiceIDQuery } from '@/utils/invoiceApiRoute'
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowMethod(req, res, 'GET')) return
  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return
  const id = parseInvoiceIDQuery(req.query)
  if (!id) return res.status(400).json({ error: 'Invalid invoice ID' })
  try {
    const response = await getInvoice(id, token)
    return res.status(response.status).json(response.data)
  } catch (error) {
    return handleBackendError(error, res)
  }
}
