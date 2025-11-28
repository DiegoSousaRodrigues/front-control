import { findAll } from '@/services/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { 'control-token': token } = parseCookies({ req })
    const response = await findAll(token)

    if (response.status === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(500).json('Error to find all client')
    }
  }
}
