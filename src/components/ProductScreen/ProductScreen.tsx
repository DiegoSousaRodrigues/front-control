import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import { TableProduct } from '../ListScreen/Tables/Product'
import { ProductDetails } from '@/types/products'
import { disableOrActiveProduct } from '@/utils/status'

export function ProductScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product/list'],
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  async function handleDisableOrActiveProduct(id: number, status: boolean) {
    await disableOrActiveProduct(id, status)
    refetch()
  }

  return (
    <ListScreen title={`Total: ${data.length} Produtos`}>
      <TableProduct data={data} handleDisableOrActiveProduct={handleDisableOrActiveProduct} />
    </ListScreen>
  )
}
