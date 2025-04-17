import { useRouter } from 'next/router'
import { ParsedUrlQueryInput } from 'querystring'
import { PropsWithChildren, useState } from 'react'
import { MdFormatListBulleted } from 'react-icons/md'
import { RiGalleryView2 } from 'react-icons/ri'
import { ChangeLayout, ChangeLayoutButton, Header, TableRoot, Title, Wrapper } from './ListScreen.styles'
import { ListScreenProps } from './ListScreen.types'

export function ListScreen({ title, children }: PropsWithChildren<ListScreenProps>) {
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
        <Title>{title}</Title>
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
        {children}
        {/* {isProduct && <TableProduct data={data as ProductDetails[]} />} */}
      </TableRoot>
    </Wrapper>
  )
}
