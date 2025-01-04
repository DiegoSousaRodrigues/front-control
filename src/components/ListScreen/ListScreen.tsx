import { MdFormatListBulleted } from 'react-icons/md'
import { RiGalleryView2 } from 'react-icons/ri'
import { ChangeLayout, ChangeLayoutButton, Header, TableRoot, Title, Wrapper } from './ListScreen.styles'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ParsedUrlQueryInput } from 'querystring'
import { ClientDetails } from '@/types/client'
import { ProductDetails } from '@/types/products'
import { TableClient } from './Tables/Client'
import { TableProduct } from './Tables/Product'

export function ListScreen({ data }: { data: ProductDetails[] | ClientDetails[] }) {
  const { replace, query, pathname } = useRouter()
  const [layout, setLayout] = useState<'list' | 'card'>((query?.layout as 'list' | 'card') || 'list')

  function changeLayout(target: 'list' | 'card') {
    return () => {
      changeFilter({ layout: target })
      setLayout(target)
    }
  }

  const isClient = pathname.includes('client')
  const isProduct = pathname.includes('product')

  function changeFilter(queryParams: string | ParsedUrlQueryInput | null | undefined) {
    replace({
      pathname,
      query: queryParams,
    })
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
        {isClient && <TableClient data={data as ClientDetails[]} />}
        {isProduct && <TableProduct data={data as ProductDetails[]} />}
      </TableRoot>
    </Wrapper>
  )
}
