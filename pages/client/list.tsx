import ListScreen from '@/components/ListScreen'
import { FindAll } from '@/services/client'
import { defaultPageProps } from '@/types/pageProps'

export default function List({ list }: defaultPageProps) {
  return <ListScreen listClient={list} />
}

export async function getServerSideProps() {
  const data = await FindAll()

  return {
    props: {
      list: data.data,
    },
  }
}
