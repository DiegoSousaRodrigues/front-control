import ListScreen from '@/components/ListScreen'
import { findAll } from '@/services/client'
import { ClientDetails } from '@/types/client'
import { GetServerSideProps } from 'next'

export default function List(props: ClientDetails[]) {
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
