import styled, { w } from 'windstitch'
import * as Theme from '@radix-ui/themes'

export const Wrapper = w.div('px-12 py-8 flex flex-col gap-6')

export const Header = w.div('flex justify-between text-sm')

export const Title = w.strong('')

export const ChangeLayout = w.div('flex gap-2')

export const ChangeLayoutButton = w.button('px-2 py-1 border border-solid rounded-md ', {
  variants: {
    active: (yes: boolean) => (yes ? 'bg-primary fill-white border-none' : 'border-primary fill-primary'),
  },
  defaultVariants: { active: false },
})

export const TableRoot = styled(Theme.Table.Root, {
  className: 'shadow-table-row',
})

export const TableHeader = styled(Theme.Table.Header, {})

export const TableRow = styled(Theme.Table.Row, {})

export const TableColumnHeaderCell = styled(Theme.Table.ColumnHeaderCell, {
  className: 'text-gray-400',
})

export const TableBody = styled(Theme.Table.Body, {})

export const TableRowHeaderCell = styled(Theme.Table.RowHeaderCell, {})

export const TableCell = styled(Theme.Table.Cell, {
  className: '',
})

export const Button = w.button('')
