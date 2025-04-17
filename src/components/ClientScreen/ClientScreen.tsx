import { ClientDetails } from '@/types/client'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableClient from '../ListScreen/Tables/Client'

export function ClientScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['client/list'], queryFn: queryFetch<ClientDetails[]> })

  if (isLoading) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  return (
    <ListScreen title={`Total: ${data.length} clientes`}>
      <TableClient data={data} />
    </ListScreen>
  )
}
