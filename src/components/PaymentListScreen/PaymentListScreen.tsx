import { listPayments } from '@/api-client/payment'
import { ClientDetails } from '@/types/client'
import { Payment } from '@/types/payment'
import { numberToBRLString } from '@/utils/currency'
import { getPaymentStatusLabel, parsePaymentFilters, validatePaymentDateRange } from '@/utils/payment'
import { queryFetch } from '@/utils/queryFetch'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { Input } from '../lib/Input/Input'
import Select from '../lib/Select'
import { FinancialState, primaryButton, secondaryButton } from '../Financial'

function PaymentCells({ payment }: { payment: Payment }) {
  return (
    <>
      <td className='px-4 py-3'>{new Date(`${payment.effectiveDate}T12:00:00`).toLocaleDateString('pt-BR')}</td>
      <th scope='row' className='px-4 py-3 text-left font-medium'>
        {payment.client.name}
      </th>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(payment.amount)}</td>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(payment.allocatedAmount)}</td>
      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(payment.creditAmount)}</td>
      <td className='px-4 py-3'>{getPaymentStatusLabel(payment.status)}</td>
      <td className='px-4 py-3'>
        <Link className='font-medium text-primary underline' href={`/payment/${payment.id}`}>
          Detalhes
        </Link>
      </td>
    </>
  )
}

export function PaymentListScreen() {
  const router = useRouter()
  const filters = router.isReady ? parsePaymentFilters(router.query) : {}
  const [draft, setDraft] = useState({ clientId: '', dateFrom: '', dateTo: '', status: '' })
  const clients = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })
  const payments = useInfiniteQuery({
    queryKey: ['payment/list', filters],
    queryFn: ({ pageParam }) => listPayments({ ...filters, cursor: pageParam, limit: 50 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: router.isReady,
    staleTime: 0,
  })
  const options = useMemo(
    () => [
      { value: 'all', label: 'Todos os clientes' },
      ...(clients.data?.map((client) => ({ value: String(client.id), label: `${client.name} · #${client.id}` })) ?? []),
    ],
    [clients.data]
  )
  const rows = payments.data?.pages.flatMap((page) => page.items) ?? []
  useEffect(() => {
    if (!router.isReady) return
    setDraft({
      clientId: filters.clientId ? String(filters.clientId) : '',
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || '',
      status: filters.status || '',
    })
  }, [router.isReady, filters.clientId, filters.dateFrom, filters.dateTo, filters.status])
  function apply(event: FormEvent) {
    event.preventDefault()
    if (!validatePaymentDateRange(draft.dateFrom || undefined, draft.dateTo || undefined)) return
    const query = {
      ...(draft.clientId && draft.clientId !== 'all' ? { clientId: draft.clientId } : {}),
      ...(draft.dateFrom ? { dateFrom: draft.dateFrom } : {}),
      ...(draft.dateTo ? { dateTo: draft.dateTo } : {}),
      ...(draft.status && draft.status !== 'all' ? { status: draft.status } : {}),
    }
    void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
  }

  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='payment-list-title'>
      <header>
        <h1 id='payment-list-title' className='text-lg font-semibold'>
          Pagamentos
        </h1>
        <p className='text-sm text-gray-600'>Consulte lançamentos registrados e estornados.</p>
      </header>
      <form onSubmit={apply} className='grid gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 xl:grid-cols-5'>
        <Select
          label='Cliente'
          items={options}
          value={draft.clientId || 'all'}
          onChange={(value) => setDraft((current) => ({ ...current, clientId: String(value) }))}
          disabled={clients.isPending || clients.isError}
        />
        <Input
          label='Data inicial'
          aria-label='Data inicial do filtro de pagamentos'
          type='date'
          value={draft.dateFrom}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setDraft((current) => ({ ...current, dateFrom: event.target.value }))
          }
        />
        <Input
          label='Data final'
          aria-label='Data final do filtro de pagamentos'
          type='date'
          value={draft.dateTo}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setDraft((current) => ({ ...current, dateTo: event.target.value }))
          }
        />
        <Select
          label='Status'
          items={[
            { value: 'all', label: 'Todos' },
            { value: 'posted', label: 'Registrado' },
            { value: 'reversed', label: 'Estornado' },
          ]}
          value={draft.status || 'all'}
          onChange={(value) => setDraft((current) => ({ ...current, status: String(value) }))}
        />
        <button className={`${primaryButton} self-end`} type='submit'>
          Aplicar filtros
        </button>
        {!validatePaymentDateRange(draft.dateFrom || undefined, draft.dateTo || undefined) && (
          <p role='alert' className='text-sm text-error sm:col-span-2 xl:col-span-5'>
            O período deve estar em ordem e ter no máximo 366 dias.
          </p>
        )}
      </form>
      {clients.isError && (
        <FinancialState role='alert'>
          <span>A lista de pagamentos está disponível, mas não foi possível carregar o filtro de clientes.</span>
          <button className={secondaryButton} onClick={() => clients.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      )}
      {payments.isFetching && !payments.isPending && !payments.isFetchingNextPage && (
        <span role='status' className='text-xs text-gray-500'>
          Atualizando pagamentos...
        </span>
      )}
      {payments.isPending ? (
        <FinancialState>Carregando pagamentos...</FinancialState>
      ) : payments.isError ? (
        <FinancialState role='alert'>
          <span>Não foi possível carregar os pagamentos.</span>
          <button className={secondaryButton} onClick={() => payments.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      ) : rows.length === 0 ? (
        <FinancialState>Nenhum pagamento encontrado para os filtros informados.</FinancialState>
      ) : (
        <>
          <div
            className='hidden overflow-x-auto rounded-xl border border-gray-200 md:block'
            role='region'
            aria-label='Lista de pagamentos'
            tabIndex={0}
          >
            <table className='w-full min-w-[800px] text-sm'>
              <caption className='sr-only'>Pagamentos encontrados</caption>
              <thead className='bg-gray-50 text-xs text-gray-600'>
                <tr>
                  {['Data', 'Cliente', 'Valor', 'Alocado', 'Crédito', 'Status', 'Ações'].map((label) => (
                    <th scope='col' className='px-4 py-3 text-left' key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {rows.map((payment) => (
                  <tr key={payment.id}>
                    <PaymentCells payment={payment} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='flex flex-col gap-3 md:hidden'>
            {rows.map((payment) => (
              <article key={payment.id} className='rounded-xl border border-gray-200 p-4'>
                <div className='flex justify-between gap-3'>
                  <h2 className='font-semibold'>{payment.client.name}</h2>
                  <span className='text-xs'>{getPaymentStatusLabel(payment.status)}</span>
                </div>
                <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-xs text-gray-500'>Data</dt>
                    <dd>{new Date(`${payment.effectiveDate}T12:00:00`).toLocaleDateString('pt-BR')}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Valor</dt>
                    <dd>{numberToBRLString(payment.amount)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Alocado</dt>
                    <dd>{numberToBRLString(payment.allocatedAmount)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Crédito</dt>
                    <dd>{numberToBRLString(payment.creditAmount)}</dd>
                  </div>
                </dl>
                <Link className='mt-3 inline-block font-medium text-primary underline' href={`/payment/${payment.id}`}>
                  Ver detalhes
                </Link>
              </article>
            ))}
          </div>
          {payments.hasNextPage && (
            <button
              className={`${secondaryButton} self-center`}
              disabled={payments.isFetchingNextPage}
              onClick={() => payments.fetchNextPage()}
            >
              {payments.isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
