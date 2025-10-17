import { OrderDetails } from '@/types/order'
import { queryFetch } from '@/utils/queryFetch'
import { disableOrActiveClient } from '@/utils/status'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableOrder from '../ListScreen/Tables/Order'

export function OrderScreen() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['order/list'],
    queryFn: queryFetch<OrderDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading || isRefetching) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  async function handleDisableOrActiveOrder(id: number, status: boolean) {
    await disableOrActiveClient(id, status)
    refetch()
  }

  return (
    <ListScreen title={`Total: ${data.length} pedidos`}>
      <TableOrder data={data} handleDisableOrActiveOrder={handleDisableOrActiveOrder} />
    </ListScreen>
  )
}
