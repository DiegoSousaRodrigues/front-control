import { MdBlock, MdFormatListBulleted, MdLockOpen, MdOutlineModeEditOutline } from 'react-icons/md'
import { RiGalleryView2 } from 'react-icons/ri'
import {
  Button,
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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ParsedUrlQueryInput } from 'querystring'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryFetch } from '@/utils/queryFetch'
import { ClientDetails } from '@/types/client'
import axios from 'axios'

export function ListScreen() {
  const { replace, query, pathname } = useRouter()
  const queryClient = useQueryClient()
  const [layout, setLayout] = useState<'list' | 'card'>((query?.layout as 'list' | 'card') || 'list')
  const { data, refetch } = useQuery({
    queryKey: ['/client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnMount: false,
  })

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  function disableOrActiveClient(id: number, status: boolean) {
    axios.post(
      `/api/client/status`,
      {},
      {
        params: {
          id,
          status: !status,
        },
      }
    )

    queryClient.invalidateQueries({ queryKey: ['/client/list'] })
  }

  return (
    <Wrapper>
      <Header>
        <Title>Total: {data?.length} clientes</Title>
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
            <TableColumnHeaderCell width={'100px'}></TableColumnHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ name, document, phone, street, id, active }) => (
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
      </TableRoot>
    </Wrapper>
  )
}
