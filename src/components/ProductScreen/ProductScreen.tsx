import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import ListScreen from '../ListScreen'
import { TableProduct } from '../ListScreen/Tables/Product'
import { ProductDetails } from '@/types/products'

export function ProductScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['product/list'], queryFn: queryFetch<ProductDetails[]> })

  if (isLoading) return <>Carregando...</>

  if (!data) return <>Dados não encontrados</>

  return (
    <ListScreen title={`Total: ${data.length} Produtos`}>
      <TableProduct data={data} />
    </ListScreen>
  )
}
