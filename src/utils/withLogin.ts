import { GetServerSidePropsContext } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

function isJwtShapeAndExpirationValid(token: string) {
  const [, payload] = token.split('.')
  if (!payload) return false

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = JSON.parse(Buffer.from(normalizedPayload, 'base64').toString('utf8'))
    return typeof decodedPayload.exp === 'number' && decodedPayload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export default function withLogin(context: GetServerSidePropsContext) {
  const { 'control-token': token } = parseCookies(context)

  if (!token || !isJwtShapeAndExpirationValid(token)) {
    destroyCookie(context, 'control-token', { path: '/' })
    destroyCookie(context, 'control-user', { path: '/' })

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
