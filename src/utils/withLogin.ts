import { GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'

export default function withLogin(context: GetServerSidePropsContext) {
  const { 'control-token': token } = parseCookies(context)

  if (!token) {
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
