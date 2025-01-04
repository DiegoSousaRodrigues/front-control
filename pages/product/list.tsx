import ListScreen from '@/components/ListScreen'
import { findAll } from '@/services/product'
import { ProductDetails } from '@/types/products'
import { GetServerSideProps } from 'next'

export default function List(props: ProductDetails[]) {
  return <ListScreen data={Object.values(props)} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await findAll()

  return {
    props: {
      ...data,
    },
  }
}
