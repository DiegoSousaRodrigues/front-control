import { ClientDetails } from '@/types/client'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableClient from '../ListScreen/Tables/Client'
import { updateClientStatus } from '@/api-client/client'
import { showToastEvent } from '@/events/events'

export function ClientScreen() {
  const { data, isLoading, refetch, isRefetching, isError, error } = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading || isRefetching) return <>Carregando...</>

  if (isError) {
    return (
      <div>
        <p>Erro ao carregar clientes: {error instanceof Error ? error.message : 'erro desconhecido'}</p>
        <button type='button' onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data?.length) return <>Nenhum cliente encontrado</>

  async function handleDisableOrActiveClient(id: number, status: boolean) {
    try {
      await updateClientStatus(id, status)
      showToastEvent({ status: 'success', description: 'Status do cliente atualizado' })
    } catch {
      showToastEvent({ status: 'error', description: 'Erro ao atualizar status do cliente' })
    } finally {
      await refetch()
    }
  }

  return (
    <ListScreen title={`Total: ${data.length} clientes`}>
      <TableClient data={data} handleDisableOrActiveClient={handleDisableOrActiveClient} />
    </ListScreen>
  )
}
