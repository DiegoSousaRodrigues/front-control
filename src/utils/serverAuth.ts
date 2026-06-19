import { NextApiRequest } from 'next'

export function getRequestToken(req: NextApiRequest) {
  const parsedCookie = req.cookies?.['control-token']
  if (parsedCookie) return parsedCookie

  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return undefined

  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('control-token='))
    ?.split('=')
    .slice(1)
    .join('=')
}
