import FormClient from '@/components/FormClient'
import { findById } from '@/services/client'
import { ClientDetails } from '@/types/client'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Edit(props: ClientDetails) {
  return <FormClient props={props} />
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const { data } = await findById(id as string)

  return {
    props: {
      ...data,
    },
  }
}
