import { MdFormatListBulleted, MdOutlineModeEditOutline } from 'react-icons/md'
import { RiGalleryView2 } from 'react-icons/ri'
import {
  ChangeLayout,
  ChangeLayoutButton,
  Header,
  Link,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
  TableRowHeaderCell,
  Title,
  Wrapper,
} from './ListScreen.styles'
import { ListScreenProps } from './ListScreen.types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ParsedUrlQueryInput } from 'querystring'

export function ListScreen({ listClient }: ListScreenProps) {
  const { replace, query, pathname } = useRouter()
  const [layout, setLayout] = useState<'list' | 'card'>((query?.layout as 'list' | 'card') || 'list')

  function changeLayout(target: 'list' | 'card') {
    return () => {
      changeFilter({ layout: target })
      setLayout(target)
    }
  }

  function changeFilter(queryParams: string | ParsedUrlQueryInput | null | undefined) {
    replace({
      pathname,
      query: queryParams,
    })
  }

  return (
    <Wrapper>
      <Header>
        <Title>Total: {listClient.length} clientes</Title>
        <ChangeLayout>
          <ChangeLayoutButton type='submit' onClick={changeLayout('card')} active={layout === 'card'}>
            <RiGalleryView2 size={20} className='fill-inherit' />
          </ChangeLayoutButton>
          <ChangeLayoutButton type='submit' onClick={changeLayout('list')} active={layout === 'list'}>
            <MdFormatListBulleted size={20} className='fill-inherit' />
          </ChangeLayoutButton>
        </ChangeLayout>

        {/* TODO fazer o seach aqui depois ??Talvez componentizar?? */}
      </Header>
      <TableRoot layout='fixed'>
        <TableHeader>
          <TableRow>
            <TableColumnHeaderCell>Nome</TableColumnHeaderCell>
            <TableColumnHeaderCell>Documento</TableColumnHeaderCell>
            <TableColumnHeaderCell>Telefone</TableColumnHeaderCell>
            <TableColumnHeaderCell>Endereço</TableColumnHeaderCell>
            <TableColumnHeaderCell width={'70px'}>Edit</TableColumnHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listClient.map(({ name, document, phone, street, id }) => (
            <TableRow key={`${name + street}`}>
              <TableRowHeaderCell>{name}</TableRowHeaderCell>
              <TableCell>{document}</TableCell>
              <TableCell>{phone}</TableCell>
              <TableCell>{street}</TableCell>
              <TableCell>
                <Link href={`/client/edit/${id}`}>
                  <MdOutlineModeEditOutline size={24} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Wrapper>
  )
}
