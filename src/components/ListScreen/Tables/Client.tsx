import { ClientDetails } from '@/types/client'
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
import { disableOrActiveClient } from '@/utils/status'

export function TableClient({ data }: { data: ClientDetails[] }) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableColumnHeaderCell>Nome</TableColumnHeaderCell>
          <TableColumnHeaderCell>Documento</TableColumnHeaderCell>
          <TableColumnHeaderCell>Telefone</TableColumnHeaderCell>
          <TableColumnHeaderCell>Endereço</TableColumnHeaderCell>
          <TableColumnHeaderCell width={'100px'}></TableColumnHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data as ClientDetails[])?.map(({ name, document, phone, street, id, active }) => (
          <TableRow key={`${name + street}`}>
            <TableRowHeaderCell>{name}</TableRowHeaderCell>
            <TableCell>{document}</TableCell>
            <TableCell>{phone}</TableCell>
            <TableCell>{street}</TableCell>
            <TableCell>
              <div className='flex gap-2'>
                <Link href={`/client/edit/${id}`}>
                  <MdOutlineModeEditOutline size={24} />
                </Link>
                <Button onClick={() => disableOrActiveClient(id, active)}>
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

export default TableClient
