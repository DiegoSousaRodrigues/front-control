import { AccountPosition, AccountPositionState, AccountStatementEventType } from '@/types/account'
import { PaymentListFilters, PaymentStatus } from '@/types/payment'
import { subtractCurrency } from './currency'
import { parsePositiveId } from './positiveId'
import axios from 'axios'

export const paymentStatuses: PaymentStatus[] = ['posted', 'reversed']
export const maxFinancialAmount = 9_999_999_999_999.99
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

export function isISODate(value: unknown): value is string {
  if (typeof value !== 'string' || !isoDatePattern.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export function getTodayInSaoPaulo(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === 'string' && paymentStatuses.includes(value as PaymentStatus)
}

export function parsePaymentFilters(query: Record<string, string | string[] | undefined>): PaymentListFilters {
  const clientId = parsePositiveId(query.clientId)
  const dateFrom = isISODate(query.dateFrom) ? query.dateFrom : undefined
  const dateTo = isISODate(query.dateTo) ? query.dateTo : undefined
  const status = isPaymentStatus(query.status) ? query.status : undefined
  return {
    ...(clientId ? { clientId } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(status ? { status } : {}),
  }
}

export function validatePaymentDateRange(dateFrom?: string, dateTo?: string): boolean {
  if (!dateFrom || !dateTo) return true
  const difference = new Date(`${dateTo}T00:00:00Z`).valueOf() - new Date(`${dateFrom}T00:00:00Z`).valueOf()
  return difference >= 0 && difference <= 366 * 24 * 60 * 60 * 1000
}

export function hasValidCentPrecision(value: number): boolean {
  if (!Number.isFinite(value)) return false
  const minorUnits = Math.round(value * 100)
  return Number.isSafeInteger(minorUnits) && Math.abs(value * 100 - minorUnits) < 1e-6
}

export function isAmbiguousMutationError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  return !error.response || error.response.status >= 500
}

export function isMutationConflictError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 409
}

export function calculatePaymentPreview(position: AccountPosition, payment: number): AccountPosition {
  const netBalance = subtractCurrency(position.netBalance, payment)
  if (netBalance > 0) return { position: 'debt', netBalance, debtAmount: netBalance, creditAmount: 0 }
  if (netBalance < 0) return { position: 'credit', netBalance, debtAmount: 0, creditAmount: Math.abs(netBalance) }
  return { position: 'settled', netBalance: 0, debtAmount: 0, creditAmount: 0 }
}

export function getPositionLabel(position: AccountPositionState): string {
  return { debt: 'Dívida', settled: 'Quitado', credit: 'Crédito' }[position]
}

export function getStatementEventLabel(type: AccountStatementEventType): string {
  return {
    invoice_issued: 'Fatura emitida',
    invoice_canceled: 'Fatura cancelada',
    payment_posted: 'Pagamento registrado',
    payment_reversed: 'Pagamento estornado',
  }[type]
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return status === 'posted' ? 'Registrado' : 'Estornado'
}
