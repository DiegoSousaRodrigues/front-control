import { create } from '@/services/order'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    const response = await create(data)

    if (response.status === 201) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to find all client')
    }
  }
}
