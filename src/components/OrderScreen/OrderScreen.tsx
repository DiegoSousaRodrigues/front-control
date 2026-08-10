import { OrderDetails } from '@/types/order'
import { getCurrentOrderMonth, isFutureOrderPeriod, parseOrderMonth } from '@/utils/orderMonth'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect } from 'react'
import { Input } from '../lib/Input/Input'
import { TableRoot } from '../ListScreen/ListScreen.styles'
import TableOrder from '../ListScreen/Tables/Order'
import { Filter, Header, Status, Title, Wrapper } from './OrderScreen.styles'

export function OrderScreen() {
  const router = useRouter()
  const currentMonth = getCurrentOrderMonth()
  const queryMonth = Array.isArray(router.query.month) ? router.query.month[0] : router.query.month
  const parsedQueryMonth = parseOrderMonth(queryMonth)
  const selectedMonth = parsedQueryMonth && !isFutureOrderPeriod(parsedQueryMonth, currentMonth) ? queryMonth : currentMonth
  const period = parseOrderMonth(selectedMonth)!
  const ordersQuery = useQuery({
    queryKey: ['order/list', { year: period.year, month: period.month }],
    queryFn: queryFetch<OrderDetails[]>,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (router.isReady && (!parsedQueryMonth || isFutureOrderPeriod(parsedQueryMonth, currentMonth))) {
      void router.replace({ pathname: router.pathname, query: { ...router.query, month: currentMonth } }, undefined, {
        shallow: true,
      })
    }
  }, [currentMonth, parsedQueryMonth, router])

  function changeMonth(event: ChangeEvent<HTMLInputElement>) {
    const month = event.target.value
    if (!parseOrderMonth(month) || month > currentMonth) return
    void router.replace({ pathname: router.pathname, query: { ...router.query, month } }, undefined, { shallow: true })
  }

  const content = (() => {
    if (ordersQuery.isLoading || ordersQuery.isFetching) return <Status>Carregando pedidos...</Status>
    if (ordersQuery.isError) {
      return (
        <Status>
          Erro ao carregar pedidos.{' '}
          <button type='button' className='underline' onClick={() => ordersQuery.refetch()}>
            Tentar novamente
          </button>
        </Status>
      )
    }
    if (!ordersQuery.data?.length) return <Status>Nenhum pedido encontrado para {selectedMonth}.</Status>
    return (
      <TableRoot layout='fixed'>
        <TableOrder data={ordersQuery.data} />
      </TableRoot>
    )
  })()

  return (
    <Wrapper>
      <Header>
        <Title>Total: {ordersQuery.data?.length ?? 0} pedidos</Title>
        <Filter>
          <Input type='month' label='Mês dos pedidos' max={currentMonth} value={selectedMonth} onChange={changeMonth} />
        </Filter>
      </Header>
      {content}
    </Wrapper>
  )
}
