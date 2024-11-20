import { changeStatus } from '@/services/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, status } = req.query

    const response = await changeStatus(id as string, status as string)

    if (response.status === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to find all client')
    }
  }
}
