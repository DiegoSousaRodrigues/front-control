import type { NextApiRequest, NextApiResponse } from 'next'
import { clearLegacyUserCookie, clearSessionCookie } from '@/utils/sessionCookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  clearSessionCookie(res)
  clearLegacyUserCookie(res)

  return res.status(204).end()
}
