import { create } from '@/services/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body
  const response = await create(data)
  if (response.status === 200) {
    res.status(200).json(response.data)
  } else {
    res.status(500).json('Error to add client')
  }
}
