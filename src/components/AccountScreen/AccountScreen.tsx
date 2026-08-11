import { findAccountStatement, findAccountSummary } from '@/api-client/account'
import { AccountStatementItem } from '@/types/account'
import { numberToBRLString } from '@/utils/currency'
import { getStatementEventLabel, isISODate } from '@/utils/payment'
import { parsePositiveId } from '@/utils/positiveId'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { AccountSummaryBlock, FinancialState, primaryButton, secondaryButton } from '../Financial'
import { Input } from '../lib/Input/Input'

function Reference({ item }: { item: AccountStatementItem }) {
  if (item.paymentId)
    return (
      <Link className='text-primary underline' href={`/payment/${item.paymentId}`}>
        Pagamento #{item.paymentId}
      </Link>
    )
  if (item.invoiceId) return <span>Fatura #{item.invoiceId}</span>
  return <span>—</span>
}

export function AccountScreen() {
  const router = useRouter()
  const id = router.isReady ? parsePositiveId(router.query.id) : null
  const dateTo = isISODate(router.query.dateTo) ? router.query.dateTo : undefined
  const [draftDateTo, setDraftDateTo] = useState(dateTo || '')
  useEffect(() => setDraftDateTo(dateTo || ''), [dateTo])
  const summary = useQuery({
    queryKey: ['client/account', { id }],
    queryFn: () => findAccountSummary(id as number),
    enabled: Boolean(id),
    staleTime: 0,
  })
  const statement = useInfiniteQuery({
    queryKey: ['client/account/statement', { id, dateTo }],
    queryFn: ({ pageParam }) => findAccountStatement(id as number, { cursor: pageParam, limit: 50, dateTo }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: Boolean(id),
    staleTime: 0,
  })
  const items = statement.data?.pages.flatMap((page) => page.items) ?? []
  if (router.isReady && !id)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>Cliente inválido.</FinancialState>
      </section>
    )
  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='account-title'>
      <header>
        <h1 id='account-title' className='text-lg font-semibold'>
          Conta do cliente
        </h1>
        <p className='text-sm text-gray-600'>Posição atual e histórico autoritativo de faturas e pagamentos.</p>
      </header>
      {summary.isPending ? (
        <FinancialState>Carregando posição da conta...</FinancialState>
      ) : summary.isError || !summary.data ? (
        <FinancialState role='alert'>
          <span>Não foi possível carregar a conta.</span>
          <button className={secondaryButton} onClick={() => summary.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      ) : (
        <>
          <AccountSummaryBlock summary={summary.data} />
          <p className='text-xs text-gray-500'>
            Posição atualizada em {new Date(summary.data.asOf).toLocaleString('pt-BR')}.
          </p>
          {summary.isFetching && (
            <span role='status' className='text-xs text-gray-500'>
              Atualizando posição...
            </span>
          )}
        </>
      )}
      <section className='flex flex-col gap-4' aria-labelledby='statement-title'>
        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
          <div>
            <h2 id='statement-title' className='font-semibold'>
              Extrato
            </h2>
            <p className='text-xs text-gray-500'>
              Saldo positivo representa dívida; saldo negativo representa crédito.
            </p>
          </div>
          <form
            className='flex items-end gap-2'
            onSubmit={(event) => {
              event.preventDefault()
              void router.replace(
                {
                  pathname: router.pathname,
                  query: { id: String(id), ...(draftDateTo ? { dateTo: draftDateTo } : {}) },
                },
                undefined,
                { shallow: true }
              )
            }}
          >
            <Input
              label='Eventos até'
              aria-label='Data final do extrato'
              type='date'
              value={draftDateTo}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDraftDateTo(event.target.value)}
            />
            <button className={primaryButton}>Aplicar</button>
          </form>
        </div>
        {statement.isPending ? (
          <FinancialState>Carregando extrato...</FinancialState>
        ) : statement.isError ? (
          <FinancialState role='alert'>
            <span>Não foi possível carregar o extrato.</span>
            <button className={secondaryButton} onClick={() => statement.refetch()}>
              Tentar novamente
            </button>
          </FinancialState>
        ) : items.length === 0 ? (
          <FinancialState>Esta conta ainda não possui movimentações.</FinancialState>
        ) : (
          <>
            <p className='text-xs text-gray-500'>
              Extrato consultado em {new Date(statement.data.pages[0].snapshotRecordedAt).toLocaleString('pt-BR')}.
            </p>
            <div
              className='hidden overflow-x-auto rounded-xl border border-gray-200 md:block'
              role='region'
              aria-label='Extrato do cliente'
              tabIndex={0}
            >
              <table className='w-full min-w-[850px] text-sm'>
                <caption className='sr-only'>Eventos financeiros da conta</caption>
                <thead className='bg-gray-50 text-xs text-gray-600'>
                  <tr>
                    {['Data', 'Evento', 'Referência', 'Débito', 'Crédito', 'Saldo após evento'].map((label) => (
                      <th scope='col' className='px-4 py-3 text-left' key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {items.map((item) => (
                    <tr key={item.eventId}>
                      <td className='px-4 py-3'>
                        {new Date(`${item.effectiveDate}T12:00:00`).toLocaleDateString('pt-BR')}
                      </td>
                      <th scope='row' className='px-4 py-3 text-left font-medium'>
                        {getStatementEventLabel(item.type)}
                      </th>
                      <td className='px-4 py-3'>
                        <Reference item={item} />
                      </td>
                      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(item.debit)}</td>
                      <td className='px-4 py-3 text-right tabular-nums'>{numberToBRLString(item.credit)}</td>
                      <td className='px-4 py-3 text-right tabular-nums'>
                        {item.balanceAfterEvent > 0 ? 'Dívida ' : item.balanceAfterEvent < 0 ? 'Crédito ' : 'Quitado '}
                        {numberToBRLString(Math.abs(item.balanceAfterEvent))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex flex-col gap-3 md:hidden'>
              {items.map((item) => (
                <article className='rounded-xl border border-gray-200 p-4' key={item.eventId}>
                  <div className='flex justify-between gap-3'>
                    <h3 className='font-semibold'>{getStatementEventLabel(item.type)}</h3>
                    <span className='text-xs'>
                      {new Date(`${item.effectiveDate}T12:00:00`).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className='mt-2 text-sm'>
                    <Reference item={item} />
                  </div>
                  <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <dt className='text-xs text-gray-500'>Débito</dt>
                      <dd>{numberToBRLString(item.debit)}</dd>
                    </div>
                    <div>
                      <dt className='text-xs text-gray-500'>Crédito</dt>
                      <dd>{numberToBRLString(item.credit)}</dd>
                    </div>
                    <div className='col-span-2'>
                      <dt className='text-xs text-gray-500'>Saldo após evento</dt>
                      <dd>
                        {item.balanceAfterEvent > 0 ? 'Dívida' : item.balanceAfterEvent < 0 ? 'Crédito' : 'Quitado'} ·{' '}
                        {numberToBRLString(Math.abs(item.balanceAfterEvent))}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            {statement.hasNextPage && (
              <button
                className={`${secondaryButton} self-center`}
                disabled={statement.isFetchingNextPage}
                onClick={() => statement.fetchNextPage()}
              >
                {statement.isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </button>
            )}
          </>
        )}
      </section>
    </section>
  )
}
