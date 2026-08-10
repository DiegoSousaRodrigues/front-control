import { ClientDetails } from '@/types/client'
import { ClientBalance, ClientBalanceMonth } from '@/types/report'
import {
  buildClientBalanceQuery,
  formatClientBalanceMonth,
  getMissingCostMessage,
  getProfitStatus,
  getProfitStatusLabel,
  ProfitStatus,
  resolveClientBalanceViewState,
  shouldFetchClientBalance,
} from '@/utils/clientBalance'
import { nullableNumberToBRLString, numberToBRLString } from '@/utils/currency'
import { parsePositiveId } from '@/utils/positiveId'
import { queryFetch } from '@/utils/queryFetch'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import Select from '../lib/Select'
import {
  Alert,
  ClientName,
  ClientStatus,
  Description,
  Filter,
  Header,
  MobileList,
  MonthCard,
  MonthCardHeader,
  MonthStat,
  MonthStats,
  MonthTerm,
  MonthTitle,
  MonthValue,
  ProfitMeta,
  ReportHeader,
  RetryButton,
  State,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRegion,
  TableRowHeader,
  Title,
  Wrapper,
} from './ClientBalanceScreen.styles'

const profitTone: Record<ProfitStatus, string> = {
  unavailable: 'text-gray-500',
  positive: 'text-emerald-700',
  negative: 'text-red-700',
  zero: 'text-gray-700',
}

function ProfitValue({ value }: { value: number | null }) {
  const status = getProfitStatus(value)
  return (
    <>
      <span className='tabular-nums'>{nullableNumberToBRLString(value)}</span>
      <ProfitMeta className={profitTone[status]}>{getProfitStatusLabel(status)}</ProfitMeta>
    </>
  )
}

function MonthCells({ month }: { month: ClientBalanceMonth }) {
  return (
    <>
      <TableRowHeader scope='row'>{formatClientBalanceMonth(month.year, month.month)}</TableRowHeader>
      <TableCell>{month.orderCount}</TableCell>
      <TableCell>{month.quantityTotal}</TableCell>
      <TableCell>{nullableNumberToBRLString(month.purchaseTotal)}</TableCell>
      <TableCell>{numberToBRLString(month.saleTotal)}</TableCell>
      <TableCell>
        <span className={`flex flex-col ${profitTone[getProfitStatus(month.profitTotal)]}`}>
          <ProfitValue value={month.profitTotal} />
        </span>
      </TableCell>
    </>
  )
}

export function ClientBalanceScreen() {
  const router = useRouter()
  const rawClientId = router.query.clientId
  const selectedClientId = router.isReady ? parsePositiveId(rawClientId) : null

  const clientsQuery = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const reportQuery = useQuery({
    queryKey: ['report/client-balance', { clientId: selectedClientId }],
    queryFn: queryFetch<ClientBalance>,
    enabled: shouldFetchClientBalance(router.isReady, selectedClientId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  useEffect(() => {
    if (!router.isReady || rawClientId === undefined || selectedClientId) return
    const query = buildClientBalanceQuery(router.query, null)
    void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false })
  }, [rawClientId, router, selectedClientId])

  const clientOptions = useMemo(
    () =>
      clientsQuery.data?.map(({ id, name, active }) => ({
        value: String(id),
        label: active ? `${name} · #${id}` : `${name} · #${id} (inativo)`,
      })) ?? [],
    [clientsQuery.data]
  )

  function changeClient(value: string | number) {
    const clientId = parsePositiveId(String(value))
    if (!clientId) return
    void router.replace(
      { pathname: router.pathname, query: buildClientBalanceQuery(router.query, clientId) },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const viewState = resolveClientBalanceViewState({
    clientId: selectedClientId,
    isLoading: reportQuery.isPending && !reportQuery.data,
    isError: reportQuery.isError,
    monthCount: reportQuery.data?.months.length,
  })
  const report = reportQuery.data

  return (
    <Wrapper aria-labelledby='client-balance-title'>
      <Header>
        <Title id='client-balance-title'>Balanço por cliente</Title>
        <Description>Consulte os totais autoritativos e a evolução mensal de um cliente.</Description>
      </Header>

      <Filter>
        <Select
          label='Cliente (obrigatório)'
          items={clientOptions}
          value={selectedClientId ? String(selectedClientId) : ''}
          onChange={changeClient}
          disabled={clientsQuery.isPending || clientsQuery.isError || clientOptions.length === 0}
        />
      </Filter>

      {clientsQuery.isPending ? (
        <State role='status'>Carregando clientes...</State>
      ) : clientsQuery.isError ? (
        <State role='alert'>
          <span>Não foi possível carregar os clientes.</span>
          <RetryButton type='button' onClick={() => clientsQuery.refetch()}>
            Tentar novamente
          </RetryButton>
        </State>
      ) : clientOptions.length === 0 ? (
        <State>Nenhum cliente disponível para consulta.</State>
      ) : viewState === 'initial' ? (
        <State>Selecione um cliente para visualizar o balanço.</State>
      ) : viewState === 'loading' ? (
        <State role='status'>Carregando balanço do cliente...</State>
      ) : viewState === 'error' ? (
        <State role='alert'>
          <span>Não foi possível carregar o balanço.</span>
          <RetryButton type='button' onClick={() => reportQuery.refetch()}>
            Tentar novamente
          </RetryButton>
        </State>
      ) : report ? (
        <>
          <ReportHeader>
            <ClientName>{report.client.name}</ClientName>
            <ClientStatus>{report.client.active ? 'Cliente ativo' : 'Cliente inativo'}</ClientStatus>
          </ReportHeader>

          {reportQuery.isFetching && <span role='status' className='text-xs text-gray-500'>Atualizando dados...</span>}

          {!report.totals.costComplete && (
            <Alert role='status'>
              <strong>Custos incompletos.</strong> {getMissingCostMessage(report.totals.missingCostItemCount)} Compra e
              lucro indisponíveis são exibidos como —.
            </Alert>
          )}

          <SummaryGrid aria-label='Totais do cliente'>
            <SummaryCard>
              <SummaryLabel>Quantidade total</SummaryLabel>
              <SummaryValue>{report.totals.quantityTotal}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Valor de compra</SummaryLabel>
              <SummaryValue>{nullableNumberToBRLString(report.totals.purchaseTotal)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Valor total (venda)</SummaryLabel>
              <SummaryValue>{numberToBRLString(report.totals.saleTotal)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Lucro</SummaryLabel>
              <SummaryValue className={`flex flex-col ${profitTone[getProfitStatus(report.totals.profitTotal)]}`}>
                <ProfitValue value={report.totals.profitTotal} />
              </SummaryValue>
            </SummaryCard>
          </SummaryGrid>

          {viewState === 'empty' ? (
            <State>Nenhum pedido encontrado para este cliente.</State>
          ) : (
            <>
              <TableRegion role='region' aria-label='Balanço mensal do cliente' tabIndex={0}>
                <Table>
                  <caption className='sr-only'>Balanço mensal de {report.client.name}</caption>
                  <TableHead>
                    <tr>
                      {['Mês', 'Pedidos', 'Quantidade', 'Compra', 'Venda', 'Lucro'].map((label) => (
                        <TableHeader scope='col' key={label}>
                          {label}
                        </TableHeader>
                      ))}
                    </tr>
                  </TableHead>
                  <TableBody>
                    {report.months.map((month, index) => (
                      <tr key={`${month.year ?? 'legacy'}-${month.month ?? 'legacy'}-${index}`}>
                        <MonthCells month={month} />
                      </tr>
                    ))}
                  </TableBody>
                </Table>
              </TableRegion>

              <MobileList aria-label='Balanço mensal do cliente'>
                {report.months.map((month, index) => (
                  <MonthCard key={`${month.year ?? 'legacy'}-${month.month ?? 'legacy'}-${index}`}>
                    <MonthCardHeader>
                      <MonthTitle>{formatClientBalanceMonth(month.year, month.month)}</MonthTitle>
                      {!month.costComplete && <ClientStatus>Custo incompleto</ClientStatus>}
                    </MonthCardHeader>
                    <MonthStats>
                      <MonthStat>
                        <MonthTerm>Pedidos</MonthTerm>
                        <MonthValue>{month.orderCount}</MonthValue>
                      </MonthStat>
                      <MonthStat>
                        <MonthTerm>Quantidade</MonthTerm>
                        <MonthValue>{month.quantityTotal}</MonthValue>
                      </MonthStat>
                      <MonthStat>
                        <MonthTerm>Compra</MonthTerm>
                        <MonthValue>{nullableNumberToBRLString(month.purchaseTotal)}</MonthValue>
                      </MonthStat>
                      <MonthStat>
                        <MonthTerm>Venda</MonthTerm>
                        <MonthValue>{numberToBRLString(month.saleTotal)}</MonthValue>
                      </MonthStat>
                      <MonthStat>
                        <MonthTerm>Lucro</MonthTerm>
                        <MonthValue className={`flex flex-col ${profitTone[getProfitStatus(month.profitTotal)]}`}>
                          <ProfitValue value={month.profitTotal} />
                        </MonthValue>
                      </MonthStat>
                    </MonthStats>
                  </MonthCard>
                ))}
              </MobileList>
            </>
          )}
        </>
      ) : null}
    </Wrapper>
  )
}
