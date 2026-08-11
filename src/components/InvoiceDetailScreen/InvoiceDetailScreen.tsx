import { cancelInvoice, findInvoice } from '@/api-client/invoice'
import { numberToBRLString } from '@/utils/currency'
import { getInvoicePaymentStatusLabel } from '@/utils/invoice'
import { isAmbiguousMutationError, isMutationConflictError } from '@/utils/payment'
import { formatOrderPeriod } from '@/utils/orderMonth'
import { parsePositiveId } from '@/utils/positiveId'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ConfirmDialog, FinancialState, primaryButton, secondaryButton } from '../Financial'

export function InvoiceDetailScreen() {
  const router = useRouter()
  const id = router.isReady ? parsePositiveId(router.query.id) : null
  const queryClient = useQueryClient()
  const [confirming, setConfirming] = useState(false)
  const invoice = useQuery({
    queryKey: ['invoice/detail', { id }],
    queryFn: () => findInvoice(id as number),
    enabled: Boolean(id),
    staleTime: 0,
  })
  const cancellation = useMutation({
    mutationFn: (reason: string) => cancelInvoice(id as number, { reason }),
    retry: false,
    onSuccess: async () => {
      setConfirming(false)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['invoice/detail', { id }] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/list'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account/statement'] }),
        queryClient.invalidateQueries({ queryKey: ['report/client-balance'] }),
      ])
    },
  })
  if (router.isReady && !id)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>Fatura inválida.</FinancialState>
      </section>
    )
  if (invoice.isPending)
    return (
      <section className='p-6'>
        <FinancialState>Carregando fatura...</FinancialState>
      </section>
    )
  if (invoice.isError || !invoice.data)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>
          <span>Não foi possível carregar a fatura.</span>
          <button className={secondaryButton} onClick={() => invoice.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      </section>
    )
  const data = invoice.data
  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='invoice-detail-title'>
      <header className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <h1 id='invoice-detail-title' className='text-lg font-semibold'>
            Fatura #{data.id}
          </h1>
          <p className='text-sm text-gray-600'>
            {data.client.name} · {formatOrderPeriod(data.period.year, data.period.month)}
          </p>
        </div>
        <Link className='font-medium text-primary underline' href={`/client/account/${data.client.id}`}>
          Ver conta do cliente
        </Link>
      </header>
      <dl className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
        {[
          ['Produtos', numberToBRLString(data.productsTotal)],
          ['Pago/alocado', numberToBRLString(data.paidAmount)],
          ['Em aberto', numberToBRLString(data.openAmount)],
          ['Pagamento', getInvoicePaymentStatusLabel(data.paymentStatus)],
          ['Status', data.status === 'issued' ? 'Emitida' : 'Cancelada'],
        ].map(([label, value]) => (
          <div className='rounded-xl border p-4' key={label}>
            <dt className='text-xs text-gray-500'>{label}</dt>
            <dd className='mt-2 font-semibold tabular-nums'>{value}</dd>
          </div>
        ))}
      </dl>
      <div className='rounded-xl border p-4'>
        <h2 className='font-semibold'>Itens</h2>
        <div className='mt-3 overflow-x-auto' role='region' aria-label='Itens da fatura' tabIndex={0}>
          <table className='w-full min-w-[1000px] text-sm'>
            <thead>
              <tr>
                {[
                  'Produto',
                  'Quantidade',
                  'Compra unitária',
                  'Compra total',
                  'Venda unitária',
                  'Venda total',
                  'Lucro',
                ].map((label) => (
                  <th scope='col' className='px-3 py-2 text-left' key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y'>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <th scope='row' className='px-3 py-2 text-left font-medium'>
                    {item.productName}
                  </th>
                  <td className='px-3 py-2'>{item.quantity}</td>
                  <td className='px-3 py-2'>{numberToBRLString(item.unitPurchasePrice)}</td>
                  <td className='px-3 py-2'>{numberToBRLString(item.purchaseTotal)}</td>
                  <td className='px-3 py-2'>{numberToBRLString(item.unitSalePrice)}</td>
                  <td className='px-3 py-2'>{numberToBRLString(item.saleTotal)}</td>
                  <td className='px-3 py-2'>{numberToBRLString(item.profitTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='rounded-xl border bg-gray-50 p-4'>
        <h2 className='font-semibold'>Snapshots na emissão</h2>
        <p className='mt-1 text-xs text-gray-500'>Não representam a dívida atual.</p>
        <dl className='mt-3 grid gap-3 sm:grid-cols-2'>
          <div>
            <dt className='text-xs text-gray-500'>Antes da emissão</dt>
            <dd>{numberToBRLString(data.accountBalanceBeforeIssue)}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-500'>Após a cobrança</dt>
            <dd>{numberToBRLString(data.accountBalanceAfterCharge)}</dd>
          </div>
        </dl>
      </div>
      {data.observation && (
        <div>
          <h2 className='font-semibold'>Observação</h2>
          <p className='whitespace-pre-wrap text-sm'>{data.observation}</p>
        </div>
      )}
      {data.status === 'canceled' && (
        <FinancialState>
          Fatura cancelada{data.cancellationReason ? `: ${data.cancellationReason}` : '.'}
        </FinancialState>
      )}
      {cancellation.isError && (
        <FinancialState role='alert'>
          Não foi possível cancelar. A API permite cancelar somente a fatura ativa mais recente.
        </FinancialState>
      )}
      {data.status === 'issued' && (
        <button
          className={`${primaryButton} self-start`}
          onClick={() => {
            cancellation.reset()
            setConfirming(true)
          }}
        >
          Cancelar fatura
        </button>
      )}
      <ConfirmDialog
        open={confirming}
        title='Cancelar esta fatura?'
        confirmLabel='Confirmar cancelamento'
        requireReason
        reasonLabel='Motivo do cancelamento'
        pending={cancellation.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={(reason) => reason && cancellation.mutate(reason)}
      >
        <p>O cancelamento preserva o histórico, remove a cobrança e recalcula as alocações do cliente.</p>
        {cancellation.isError && (
          <p role='alert' className='mt-2 font-medium text-error'>
            {isMutationConflictError(cancellation.error)
              ? 'A fatura mudou de estado ou não é mais a última ativa. Feche a confirmação e atualize os dados.'
              : isAmbiguousMutationError(cancellation.error)
                ? 'Não foi possível confirmar o resultado. Antes de repetir, feche a confirmação e confira a fatura e o extrato.'
                : 'O cancelamento foi rejeitado. O motivo foi preservado para você revisar e tentar novamente.'}
          </p>
        )}
      </ConfirmDialog>
    </section>
  )
}
