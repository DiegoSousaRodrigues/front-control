import { TableBody, TableColumnHeaderCell, TableHeader, TableRow, TableRowHeaderCell } from '../ListScreen.styles'
import { OrderDetails } from '@/types/order'
import { numberToBRLString } from '@/utils/currency'
import { formatOrderPeriod } from '@/utils/orderMonth'

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
          <TableColumnHeaderCell>Mês</TableColumnHeaderCell>
          <TableColumnHeaderCell>Preço total</TableColumnHeaderCell>
          <TableColumnHeaderCell>Total a receber</TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(({ id, client: { fullAddress, name }, orderYear, orderMonth, priceTotal, amountDue }) => (
          <TableRow key={id}>
            <TableRowHeaderCell>{name}</TableRowHeaderCell>
            <TableRowHeaderCell>{fullAddress}</TableRowHeaderCell>
            <TableRowHeaderCell>{formatOrderPeriod(orderYear, orderMonth)}</TableRowHeaderCell>
            <TableRowHeaderCell>{numberToBRLString(priceTotal)}</TableRowHeaderCell>
            <TableRowHeaderCell>{numberToBRLString(amountDue)}</TableRowHeaderCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

export default TableOrder
