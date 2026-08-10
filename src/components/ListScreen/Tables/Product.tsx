import { ProductDetails } from '@/types/products'
import {
  Button,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRow,
  TableRowHeaderCell,
} from '../ListScreen.styles'
import Link from 'next/link'
import { MdBlock, MdLockOpen, MdOutlineModeEditOutline } from 'react-icons/md'
import { nullableNumberToBRLString, numberToBRLString } from '@/utils/currency'

export function TableProduct({
  data,
  handleDisableOrActiveProduct,
  pendingStatusProductIds = [],
}: {
  data: ProductDetails[]
  handleDisableOrActiveProduct: (id: number, status: boolean) => void
  pendingStatusProductIds?: number[]
}) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableColumnHeaderCell>Nome</TableColumnHeaderCell>
          <TableColumnHeaderCell>Compra</TableColumnHeaderCell>
          <TableColumnHeaderCell>Venda</TableColumnHeaderCell>
          <TableColumnHeaderCell>Ações</TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as ProductDetails[])?.map(({ name, purchasePrice, salePrice, id, active }) => (
          <TableRow key={id}>
            <TableRowHeaderCell>{name}</TableRowHeaderCell>
            <TableRowHeaderCell>{nullableNumberToBRLString(purchasePrice)}</TableRowHeaderCell>
            <TableRowHeaderCell>{numberToBRLString(salePrice)}</TableRowHeaderCell>
            <TableCell>
              <div className='flex gap-2'>
                <Link href={`/product/edit/${id}`}>
                  <MdOutlineModeEditOutline size={24} />
                </Link>
                <Button
                  disabled={pendingStatusProductIds.includes(id)}
                  onClick={() => handleDisableOrActiveProduct(id, active)}
                >
                  {active ? (
                    <MdBlock size={24} className='fill-error' />
                  ) : (
                    <MdLockOpen size={24} className='fill-success' />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}
