/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestToken } from '@/utils/serverAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { getAuthHeader } from '@/utils/auth'
import { rejectWithoutToken } from '@/utils/apiRoute'
import { parsePositiveId } from '@/utils/positiveId'

const MAX_MULTIPART_BYTES = 10 * 1024 * 1024
const BACKEND_TIMEOUT_MS = 15000

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    res.setHeader('Allow', ['POST', 'PUT'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let backendUrl = 'http://localhost:3001/sku'
  if (req.method === 'PUT') {
    const productId = parsePositiveId(req.query.id)
    if (!productId) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }
    backendUrl += `/${productId}`
  }

  const token = getRequestToken(req)
  if (rejectWithoutToken(res, token)) return

  const contentType = req.headers['content-type']
  if (!contentType?.startsWith('multipart/form-data')) {
    return res.status(415).json({ error: 'Unsupported media type' })
  }

  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength > MAX_MULTIPART_BYTES) {
    return res.status(413).json({ error: 'Payload too large' })
  }

  try {
    const response = await axios({
      method: req.method,
      url: backendUrl,
      data: req,
      headers: {
        'Content-Type': contentType,
        ...getAuthHeader(token),
      },
      responseType: 'stream',
      timeout: BACKEND_TIMEOUT_MS,
      maxBodyLength: MAX_MULTIPART_BYTES,
      maxContentLength: MAX_MULTIPART_BYTES,
      validateStatus: () => true,
    })

    res.status(response.status)

    if (response.status >= 400) {
      const chunks: Buffer[] = []
      for await (const chunk of response.data) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }

      const body = Buffer.concat(chunks).toString('utf8')
      try {
        return res.json(JSON.parse(body))
      } catch {
        return res.json({ error: body || 'Backend error' })
      }
    }

    return response.data.pipe(res)
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Timeout ao conectar com o backend.' })
    }

    return res.status(500).json({ error: 'Erro ao conectar com o backend.' })
  }
}
