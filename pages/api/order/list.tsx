import { findAll } from '@/services/order'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const response = await findAll()

    if (response.status === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to find all client')
    }
  }
}
