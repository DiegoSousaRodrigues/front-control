import { OrderDetails } from '@/types/order'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import TableOrder from '../ListScreen/Tables/Order'

export function OrderScreen() {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['order/list'],
    queryFn: queryFetch<OrderDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading || isRefetching) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  return (
    <ListScreen title={`Total: ${data.length} pedidos`}>
      <TableOrder data={data} />
    </ListScreen>
  )
}
