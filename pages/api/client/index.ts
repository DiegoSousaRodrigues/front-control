import { Create } from '@/services/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body
  const response = Create(data)
  res.status(200).json({ message: 'Hello from Next.js!' })
}
