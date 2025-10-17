import { TableBody, TableColumnHeaderCell, TableHeader, TableRow, TableRowHeaderCell } from '../ListScreen.styles'
import { OrderDetails } from '@/types/order'

type TableOrderProps = {
  data: OrderDetails[]
  handleDisableOrActiveOrder: (id: number, status: boolean) => void
}

export function TableOrder({ data }: TableOrderProps) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableColumnHeaderCell>Id</TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(({ id }) => (
          <TableRow key={id}>
            <TableRowHeaderCell>{id}</TableRowHeaderCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

export default TableOrder
