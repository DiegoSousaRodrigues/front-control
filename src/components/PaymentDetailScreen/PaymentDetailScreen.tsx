import { findPayment, reversePayment } from '@/api-client/payment'
import { numberToBRLString } from '@/utils/currency'
import { getPaymentStatusLabel, isAmbiguousMutationError, isMutationConflictError } from '@/utils/payment'
import { parsePositiveId } from '@/utils/positiveId'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ConfirmDialog, FinancialState, primaryButton, secondaryButton } from '../Financial'

export function PaymentDetailScreen() {
  const router = useRouter()
  const id = router.isReady ? parsePositiveId(router.query.id) : null
  const queryClient = useQueryClient()
  const [confirming, setConfirming] = useState(false)
  const payment = useQuery({
    queryKey: ['payment/detail', { id }],
    queryFn: () => findPayment(id as number),
    enabled: Boolean(id),
    staleTime: 0,
  })
  const reversal = useMutation({
    mutationFn: (reason: string) => reversePayment(id as number, { reason }),
    retry: false,
    onSuccess: async () => {
      setConfirming(false)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['payment/detail', { id }] }),
        queryClient.invalidateQueries({ queryKey: ['payment/list'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account'] }),
        queryClient.invalidateQueries({ queryKey: ['client/account/statement'] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/list'] }),
        queryClient.invalidateQueries({ queryKey: ['invoice/detail'] }),
        queryClient.invalidateQueries({ queryKey: ['report/financial'] }),
      ])
    },
  })
  if (router.isReady && !id)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>Pagamento inválido.</FinancialState>
      </section>
    )
  if (payment.isPending)
    return (
      <section className='p-6'>
        <FinancialState>Carregando pagamento...</FinancialState>
      </section>
    )
  if (payment.isError || !payment.data)
    return (
      <section className='p-6'>
        <FinancialState role='alert'>
          <span>Não foi possível carregar o pagamento.</span>
          <button className={secondaryButton} onClick={() => payment.refetch()}>
            Tentar novamente
          </button>
        </FinancialState>
      </section>
    )
  const data = payment.data
  return (
    <section className='flex flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='payment-detail-title'>
      <header className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <h1 id='payment-detail-title' className='text-lg font-semibold'>
            Pagamento #{data.id}
          </h1>
          <p className='text-sm text-gray-600'>
            {data.client.name} · {getPaymentStatusLabel(data.status)}
          </p>
        </div>
        <Link className='font-medium text-primary underline' href={`/client/account/${data.client.id}`}>
          Ver conta do cliente
        </Link>
      </header>
      <dl className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {[
          ['Data efetiva', new Date(`${data.effectiveDate}T12:00:00`).toLocaleDateString('pt-BR')],
          ['Valor', numberToBRLString(data.amount)],
          ['Valor alocado', numberToBRLString(data.allocatedAmount)],
          ['Crédito restante', numberToBRLString(data.creditAmount)],
        ].map(([label, value]) => (
          <div className='rounded-xl border border-gray-200 p-4' key={label}>
            <dt className='text-xs text-gray-500'>{label}</dt>
            <dd className='mt-2 font-semibold tabular-nums'>{value}</dd>
          </div>
        ))}
      </dl>
      <div className='rounded-xl border border-gray-200 p-4'>
        <h2 className='font-semibold'>Observação</h2>
        <p className='mt-2 whitespace-pre-wrap text-sm text-gray-700'>{data.observation || 'Sem observação.'}</p>
      </div>
      <div>
        <h2 className='mb-3 font-semibold'>Alocações em faturas</h2>
        {data.allocations.length === 0 ? (
          <FinancialState>Nenhum valor alocado; o pagamento permanece como crédito.</FinancialState>
        ) : (
          <ul className='divide-y divide-gray-100 rounded-xl border border-gray-200'>
            {data.allocations.map((allocation) => (
              <li className='flex justify-between gap-3 p-4 text-sm' key={allocation.invoiceId}>
                <span>Fatura #{allocation.invoiceId}</span>
                <strong>{numberToBRLString(allocation.amount)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data.status === 'reversed' && (
        <FinancialState>Estornado{data.reversalReason ? `: ${data.reversalReason}` : '.'}</FinancialState>
      )}
      {reversal.isError && (
        <FinancialState role='alert'>
          O estorno não foi confirmado. Confira o pagamento e o extrato antes de realizar uma nova tentativa.
        </FinancialState>
      )}
      {data.status === 'posted' && (
        <button
          className={`${primaryButton} self-start`}
          onClick={() => {
            reversal.reset()
            setConfirming(true)
          }}
        >
          Estornar pagamento
        </button>
      )}
      <ConfirmDialog
        open={confirming}
        title='Estornar este pagamento?'
        confirmLabel='Confirmar estorno'
        requireReason
        reasonLabel='Motivo do estorno'
        pending={reversal.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={(reason) => reason && reversal.mutate(reason)}
      >
        <p>O estorno reabrirá dívidas e recalculará as alocações do cliente. Esta operação preserva o histórico.</p>
        {reversal.isError && (
          <p role='alert' className='mt-2 font-medium text-error'>
            {isMutationConflictError(reversal.error)
              ? 'O pagamento mudou de estado e não pode ser estornado nesta condição. Feche a confirmação e atualize os dados.'
              : isAmbiguousMutationError(reversal.error)
                ? 'Não foi possível confirmar o resultado. Antes de repetir, feche a confirmação e confira o pagamento e o extrato.'
                : 'O estorno foi rejeitado. O motivo foi preservado para você revisar e tentar novamente.'}
          </p>
        )}
      </ConfirmDialog>
    </section>
  )
}
