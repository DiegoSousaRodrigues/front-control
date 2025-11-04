import { ClientDetails } from '@/types/client'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableClient from '../ListScreen/Tables/Client'
import { updateClientStatus } from '@/api-client/client'

export function ClientScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading || isRefetching) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  async function handleDisableOrActiveClient(id: number, status: boolean) {
    await updateClientStatus(id, status)
    refetch()
  }

  return (
    <ListScreen title={`Total: ${data.length} clientes`}>
      <TableClient data={data} handleDisableOrActiveClient={handleDisableOrActiveClient} />
    </ListScreen>
  )
}
