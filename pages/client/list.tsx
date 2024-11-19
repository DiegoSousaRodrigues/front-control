import ListScreen from '@/components/ListScreen'
import { findAll } from '@/services/client'
import { defaultPageProps } from '@/types/pageProps'

export default function List({ list }: defaultPageProps) {
  return <ListScreen listClient={list} />
}

export async function getServerSideProps() {
  const data = await findAll()

  return {
    props: {
      list: data.data,
    },
  }
}
