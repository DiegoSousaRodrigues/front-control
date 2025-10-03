import FormProduct from '@/components/FormProduct'
import { findById } from '@/services/product'
import { ClientDetails } from '@/types/client'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Edit(props: ClientDetails) {
  return <FormProduct props={props} type='edit' />
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
