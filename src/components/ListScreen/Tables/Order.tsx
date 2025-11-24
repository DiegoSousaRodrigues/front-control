import { TableBody, TableColumnHeaderCell, TableHeader, TableRow, TableRowHeaderCell } from '../ListScreen.styles'
import { OrderDetails } from '@/types/order'

type TableOrderProps = {
  data: OrderDetails[]
}

export function TableOrder({ data }: TableOrderProps) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableColumnHeaderCell>Cliente</TableColumnHeaderCell>
          <TableColumnHeaderCell>Endereço</TableColumnHeaderCell>
          <TableColumnHeaderCell>Preço total</TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(({ id, client: { fullAddress, name }, priceTotal }) => (
          <TableRow key={id}>
            <TableRowHeaderCell>{name}</TableRowHeaderCell>
            <TableRowHeaderCell>{fullAddress}</TableRowHeaderCell>
            <TableRowHeaderCell>{priceTotal}</TableRowHeaderCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

export default TableOrder
