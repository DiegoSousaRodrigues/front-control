import { OrderDetails } from '@/types/order'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableOrder from '../ListScreen/Tables/Order'

export function OrderScreen() {
  const { data, isLoading, isRefetching, isError, error, refetch } = useQuery({
    queryKey: ['order/list'],
    queryFn: queryFetch<OrderDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading || isRefetching) return <>Carregando...</>

  if (isError) {
    return (
      <div>
        <p>Erro ao carregar pedidos: {error instanceof Error ? error.message : 'erro desconhecido'}</p>
        <button type='button' onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data?.length) return <>Nenhum pedido encontrado</>

  return (
    <ListScreen title={`Total: ${data.length} pedidos`}>
      <TableOrder data={data} />
    </ListScreen>
  )
}
