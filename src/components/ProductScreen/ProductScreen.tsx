import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import { TableProduct } from '../ListScreen/Tables/Product'
import { ProductDetails } from '@/types/products'
import { updateProductStatus } from '@/api-client/product'
import { showToastEvent } from '@/events/events'

export function ProductScreen() {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['product/list'],
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
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

  async function handleDisableOrActiveProduct(id: number, status: boolean) {
    try {
      await updateProductStatus(id, status)
      showToastEvent({ status: 'success', description: 'Status do produto atualizado' })
    } catch {
      showToastEvent({ status: 'error', description: 'Erro ao atualizar status do produto' })
    } finally {
      await refetch()
    }
  }

  return (
    <ListScreen title={`Total: ${data.length} Produtos`}>
      <TableProduct data={data} handleDisableOrActiveProduct={handleDisableOrActiveProduct} />
    </ListScreen>
  )
}
