import { create, update } from '@/services/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = req.body
    const response = await create(data)
    if (response.status === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to add client')
    }
  }
  if (req.method === 'PUT') {
    const data = req.body
    const response = await update(data, '1')
    if (response.status === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to update client')
    }
  }
}
