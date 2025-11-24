/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Definimos a URL do Go.
  // Se for PUT (update), você precisará ajustar para pegar o ID da query string, ex: req.query.id
  // Como seu exemplo anterior estava fixo ou focado no POST, vamos apontar para a base:
  const backendUrl = 'http://localhost:3001/sku'

  try {
    const response = await axios({
      method: req.method,
      url: backendUrl,
      data: req,
      headers: {
        'Content-Type': req.headers['content-type'],
      },
      responseType: 'stream',
      validateStatus: () => true,
    })

    res.status(response.status)

    response.data.pipe(res)
  } catch (error: any) {
    console.error('Erro no stream:', error.message)
    res.status(500).json({ error: 'Erro ao conectar com o backend.' })
  }
}
