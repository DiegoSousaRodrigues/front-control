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

export function TableProduct({
  data,
  handleDisableOrActiveProduct,
}: {
  data: ProductDetails[]
  handleDisableOrActiveProduct: (id: number, status: boolean) => void
}) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableColumnHeaderCell>Nome</TableColumnHeaderCell>
          <TableColumnHeaderCell>Preço</TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as ProductDetails[])?.map(({ name, price, id, active }) => (
          <TableRow key={id}>
            <TableRowHeaderCell>{name}</TableRowHeaderCell>
            <TableRowHeaderCell>{price}</TableRowHeaderCell>
            <TableCell>
              <div className='flex gap-2'>
                <Link href={`/product/edit/${id}`}>
                  <MdOutlineModeEditOutline size={24} />
                </Link>
                <Button onClick={() => handleDisableOrActiveProduct(id, active)}>
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
