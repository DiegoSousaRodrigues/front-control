import { ClientDetails } from '@/types/client'
import { queryFetch } from '@/utils/queryFetch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import ListScreen from '../ListScreen'
import TableClient from '../ListScreen/Tables/Client'
import { updateClientStatus } from '@/api-client/client'
import { showToastEvent } from '@/events/events'

export function ClientScreen() {
  const queryClient = useQueryClient()
  const queryKey = ['client/list']
  const [pendingStatusClientIds, setPendingStatusClientIds] = useState<number[]>([])
  const { data, isLoading, refetch, isRefetching, isError, error } = useQuery({
    queryKey,
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => updateClientStatus(id, active),
    onMutate: async ({ id, active }) => {
      setPendingStatusClientIds((ids) => [...ids, id])
      await queryClient.cancelQueries({ queryKey })
      const previousClients = queryClient.getQueryData<ClientDetails[]>(queryKey)

      queryClient.setQueryData<ClientDetails[]>(queryKey, (clients) =>
        clients?.map((client) => (client.id === id ? { ...client, active: !active } : client))
      )

      return { previousClients }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousClients) {
        queryClient.setQueryData(queryKey, context.previousClients)
      }

      showToastEvent({ status: 'error', description: 'Erro ao atualizar status do cliente' })
    },
    onSuccess: () => {
      showToastEvent({ status: 'success', description: 'Status do cliente atualizado' })
    },
    onSettled: async (_data, _error, variables) => {
      setPendingStatusClientIds((ids) => ids.filter((id) => id !== variables.id))
      await queryClient.invalidateQueries({ queryKey })
    },
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

  function handleDisableOrActiveClient(id: number, status: boolean) {
    if (pendingStatusClientIds.includes(id)) return
    statusMutation.mutate({ id, active: status })
  }

  return (
    <ListScreen title={`Total: ${data.length} clientes`}>
      <TableClient
        data={data}
        handleDisableOrActiveClient={handleDisableOrActiveClient}
        pendingStatusClientIds={pendingStatusClientIds}
      />
    </ListScreen>
  )
}
