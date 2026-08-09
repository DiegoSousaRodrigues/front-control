import { queryFetch } from '@/utils/queryFetch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import { TableProduct } from '../ListScreen/Tables/Product'
import { ProductDetails } from '@/types/products'
import { updateProductStatus } from '@/api-client/product'
import { showToastEvent } from '@/events/events'
import { useState } from 'react'

export function ProductScreen() {
  const queryClient = useQueryClient()
  const queryKey = ['product/list']
  const [pendingStatusProductIds, setPendingStatusProductIds] = useState<number[]>([])
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey,
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => updateProductStatus(id, active),
    onMutate: async ({ id, active }) => {
      setPendingStatusProductIds((ids) => [...ids, id])
      await queryClient.cancelQueries({ queryKey })
      const previousProducts = queryClient.getQueryData<ProductDetails[]>(queryKey)

      queryClient.setQueryData<ProductDetails[]>(queryKey, (products) =>
        products?.map((product) => (product.id === id ? { ...product, active: !active } : product))
      )

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKey, context.previousProducts)
      }

      showToastEvent({ status: 'error', description: 'Erro ao atualizar status do produto' })
    },
    onSuccess: () => {
      showToastEvent({ status: 'success', description: 'Status do produto atualizado' })
    },
    onSettled: async (_data, _error, variables) => {
      setPendingStatusProductIds((ids) => ids.filter((id) => id !== variables.id))
      await queryClient.invalidateQueries({ queryKey })
    },
  })

  if (isLoading) return <>Carregando...</>

  if (isError) {
    return (
      <div>
        <p>Erro ao carregar produtos: {error instanceof Error ? error.message : 'erro desconhecido'}</p>
        <button type='button' onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data?.length) return <>Nenhum produto encontrado</>

  function handleDisableOrActiveProduct(id: number, status: boolean) {
    if (pendingStatusProductIds.includes(id)) return
    statusMutation.mutate({ id, active: status })
  }

  return (
    <ListScreen title={`Total: ${data.length} Produtos`}>
      <TableProduct
        data={data}
        handleDisableOrActiveProduct={handleDisableOrActiveProduct}
        pendingStatusProductIds={pendingStatusProductIds}
      />
    </ListScreen>
  )
}
