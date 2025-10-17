import FormProduct from '@/components/FormProduct'
import { findById } from '@/services/product'
import { ProductDetails } from '@/types/products'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Edit(props: ProductDetails) {
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
