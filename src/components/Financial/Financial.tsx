import { AccountPosition, AccountSummary } from '@/types/account'
import { getPositionLabel } from '@/utils/payment'
import { numberToBRLString } from '@/utils/currency'
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react'

export const primaryButton =
  'rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
export const secondaryButton =
  'rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export function FinancialState({ children, role = 'status' }: { children: ReactNode; role?: 'status' | 'alert' }) {
  return (
    <div
      role={role}
      className='flex min-h-16 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700'
    >
      {children}
    </div>
  )
}

export function PositionCards({
  position,
  openInvoiceCount,
}: {
  position: AccountPosition
  openInvoiceCount?: number
}) {
  const cards = [
    ['Dívida em aberto', numberToBRLString(position.debtAmount)],
    ['Crédito disponível', numberToBRLString(position.creditAmount)],
    ['Posição líquida', `${getPositionLabel(position.position)} · ${numberToBRLString(Math.abs(position.netBalance))}`],
    ...(openInvoiceCount === undefined ? [] : [['Faturas em aberto', String(openInvoiceCount)]]),
  ]
  return (
    <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map(([label, value]) => (
        <div className='rounded-xl border border-gray-200 p-4' key={label}>
          <dt className='text-xs text-gray-500'>{label}</dt>
          <dd className='mt-2 text-lg font-semibold tabular-nums'>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function AccountSummaryBlock({ summary }: { summary: AccountSummary }) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-semibold'>{summary.client.name}</h2>
        {!summary.client.active && <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>Cliente inativo</span>}
      </div>
      <PositionCards position={summary} openInvoiceCount={summary.openInvoiceCount} />
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  pending?: boolean
  onCancel: () => void
  onConfirm: (reason?: string) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState('')
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])
  useEffect(() => {
    if (!open) setReason('')
  }, [open])
  function submit(event: FormEvent) {
    event.preventDefault()
    onConfirm(reason.trim() || undefined)
  }
  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault()
        if (!pending) onCancel()
      }}
      className='w-[min(92vw,32rem)] rounded-xl p-0 shadow-xl backdrop:bg-black/40'
      aria-labelledby='financial-dialog-title'
    >
      <form onSubmit={submit} className='flex flex-col gap-4 p-6'>
        <h2 id='financial-dialog-title' className='text-lg font-semibold'>
          {title}
        </h2>
        <div className='text-sm text-gray-700'>{children}</div>
        {confirmLabel === 'Confirmar estorno' && (
          <label className='flex flex-col gap-1 text-sm'>
            Motivo do estorno
            <textarea
              autoFocus
              required
              maxLength={1000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className='min-h-24 rounded-lg border border-gray-300 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
            />
          </label>
        )}
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <button type='button' className={secondaryButton} disabled={pending} onClick={onCancel}>
            Cancelar
          </button>
          <button type='submit' className={primaryButton} disabled={pending}>
            {pending ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </form>
    </dialog>
  )
}
