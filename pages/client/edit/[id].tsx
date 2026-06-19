import FormClient from '@/components/FormClient'
import { findById } from '@/services/client'
import { ClientDetails } from '@/types/client'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'

export default function Edit(props: ClientDetails) {
  return <FormClient props={props} type='edit' />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const { 'control-token': token } = parseCookies(context)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data } = await findById(id as string, token)

  return {
    props: {
      ...data,
    },
  }
}
