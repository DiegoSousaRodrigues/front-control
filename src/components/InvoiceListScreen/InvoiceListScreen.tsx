import { listInvoices } from '@/api-client/invoice'
import { ClientDetails } from '@/types/client'
import { InvoiceSummary } from '@/types/invoice'
import { numberToBRLString } from '@/utils/currency'
import { getInvoicePaymentStatusLabel } from '@/utils/invoice'
import { formatOrderPeriod, getCurrentOrderMonth, isFutureOrderPeriod, parseOrderMonth } from '@/utils/orderMonth'
import { parsePositiveId } from '@/utils/positiveId'
import { queryFetch } from '@/utils/queryFetch'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { FinancialState, primaryButton, secondaryButton } from '../Financial'
import { Input } from '../lib/Input/Input'
import Select from '../lib/Select'

function InvoiceCells({ invoice }: { invoice: InvoiceSummary }) {
  return (
    <>
      <th scope='row' className='px-4 py-3 text-left font-medium'>
        {invoice.client.name}
      </th>
      <td className='px-4 py-3'>{formatOrderPeriod(invoice.period.year, invoice.period.month)}</td>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(invoice.productsTotal)}</td>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(invoice.paidAmount)}</td>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(invoice.openAmount)}</td>
      <td className='px-4 py-3'>{getInvoicePaymentStatusLabel(invoice.paymentStatus)}</td>
      <td className='px-4 py-3'>{invoice.status === 'issued' ? 'Emitida' : 'Cancelada'}</td>
      <td className='px-4 py-3'>
        <Link className='font-medium text-primary underline' href={`/invoice/${invoice.id}`}>
          Detalhes
        </Link>
      </td>
    </>
  )
}

export function InvoiceListScreen() {
  const router = useRouter()
  const currentMonth = getCurrentOrderMonth()
  const rawMonth = Array.isArray(router.query.month) ? undefined : router.query.month
  const parsed = parseOrderMonth(rawMonth)
  const selectedMonth = parsed && !isFutureOrderPeriod(parsed, currentMonth) ? (rawMonth as string) : currentMonth
  const period = parseOrderMonth(selectedMonth)!
  const selectedClientId = parsePositiveId(router.query.clientId)
  const [draftClient, setDraftClient] = useState('all')
  const clients = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const invoices = useInfiniteQuery({
    queryKey: ['invoice/list', { ...period, clientId: selectedClientId }],
    queryFn: ({ pageParam }) =>
      listInvoices({
        ...period,
        ...(selectedClientId ? { clientId: selectedClientId } : {}),
        cursor: pageParam,
        limit: 50,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: router.isReady,
    staleTime: 0,
  })
  const options = useMemo(
    () => [
      { value: 'all', label: 'Todos os clientes' },
      ...(clients.data?.map(({ id, name, active }) => ({
        value: String(id),
        label: `${name} · #${id}${active ? '' : ' (inativo)'}`,
      })) ?? []),
    ],
    [clients.data]
  )
  const rows = invoices.data?.pages.flatMap(({ items }) => items) ?? []
  useEffect(() => {
    if (!router.isReady) return
    const invalidClient = router.query.clientId !== undefined && !selectedClientId
    if (!parsed || isFutureOrderPeriod(parsed, currentMonth) || invalidClient) {
      void router.replace(
        {
          pathname: router.pathname,
          query: {
            month: parsed && !isFutureOrderPeriod(parsed, currentMonth) ? selectedMonth : currentMonth,
            ...(selectedClientId ? { clientId: String(selectedClientId) } : {}),
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [currentMonth, parsed, router, selectedClientId, selectedMonth])
  useEffect(() => setDraftClient(selectedClientId ? String(selectedClientId) : 'all'), [selectedClientId])
  function changeMonth(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const next = parseOrderMonth(value)
    if (!next || isFutureOrderPeriod(next, currentMonth)) return
    void router.replace({ pathname: router.pathname, query: { ...router.query, month: value } }, undefined, {
      shallow: true,
    })
  }
  function applyClient(event: FormEvent) {
    event.preventDefault()
    void router.replace(
      {
        pathname: router.pathname,
        query: { month: selectedMonth, ...(draftClient !== 'all' ? { clientId: draftClient } : {}) },
      },
      undefined,
      { shallow: true }
    )
  }
  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='invoice-list-title'>
      <header>
        <h1 id='invoice-list-title' className='text-lg font-semibold'>
          Faturas
        </h1>
        <p className='text-sm text-gray-600'>Valores pagos e em aberto são posições atuais da fatura.</p>
      </header>
      <form
        onSubmit={applyClient}
        className='grid gap-3 rounded-xl border p-4 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)_auto]'
      >
        <Input type='month' label='Competência' max={currentMonth} value={selectedMonth} onChange={changeMonth} />
        <Select
          label='Cliente'
          items={options}
          value={draftClient}
          onChange={(value) => setDraftClient(String(value))}
          disabled={clients.isPending || clients.isError}
        />
        <button className={`${primaryButton} self-end`}>Aplicar</button>
      </form>
      {clients.isError && (
        <FinancialState role='alert'>
          <span>Não foi possível carregar o filtro de clientes.</span>
          <button className={secondaryButton} onClick={() => clients.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      )}
      {invoices.isFetching && !invoices.isPending && !invoices.isFetchingNextPage && (
        <span role='status' className='text-xs text-gray-500'>
          Atualizando faturas...
        </span>
      )}
      {invoices.isPending ? (
        <FinancialState>Carregando faturas...</FinancialState>
      ) : invoices.isError ? (
        <FinancialState role='alert'>
          <span>Não foi possível carregar as faturas.</span>
          <button className={secondaryButton} onClick={() => invoices.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      ) : rows.length === 0 ? (
        <FinancialState>Nenhuma fatura encontrada em {selectedMonth}.</FinancialState>
      ) : (
        <>
          <div
            className='hidden overflow-x-auto rounded-xl border md:block'
            role='region'
            aria-label='Lista de faturas'
            tabIndex={0}
          >
            <table className='w-full min-w-[900px] text-sm'>
              <caption className='sr-only'>Faturas da competência {selectedMonth}</caption>
              <thead className='bg-gray-50 text-xs text-gray-600'>
                <tr>
                  {['Cliente', 'Competência', 'Produtos', 'Pago', 'Em aberto', 'Pagamento', 'Status', 'Ações'].map(
                    (label) => (
                      <th scope='col' className='px-4 py-3 text-left' key={label}>
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className='divide-y'>
                {rows.map((invoice) => (
                  <tr key={invoice.id}>
                    <InvoiceCells invoice={invoice} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex flex-col gap-3 md:hidden'>
            {rows.map((invoice) => (
              <article className='rounded-xl border p-4' key={invoice.id}>
                <div className='flex justify-between gap-3'>
                  <h2 className='font-semibold'>{invoice.client.name}</h2>
                  <span className='text-xs'>{invoice.status === 'issued' ? 'Emitida' : 'Cancelada'}</span>
                </div>
                <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-xs text-gray-500'>Competência</dt>
                    <dd>{formatOrderPeriod(invoice.period.year, invoice.period.month)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Produtos</dt>
                    <dd>{numberToBRLString(invoice.productsTotal)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Pago</dt>
                    <dd>{numberToBRLString(invoice.paidAmount)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Em aberto</dt>
                    <dd>{numberToBRLString(invoice.openAmount)}</dd>
                  </div>
                </dl>
                <p className='mt-2 text-xs'>{getInvoicePaymentStatusLabel(invoice.paymentStatus)}</p>
                <Link className='mt-3 inline-block font-medium text-primary underline' href={`/invoice/${invoice.id}`}>
                  Ver detalhes
                </Link>
              </article>
            ))}
          </div>
          {invoices.hasNextPage && (
            <button
              className={`${secondaryButton} self-center`}
              disabled={invoices.isFetchingNextPage}
              onClick={() => invoices.fetchNextPage()}
            >
              {invoices.isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
