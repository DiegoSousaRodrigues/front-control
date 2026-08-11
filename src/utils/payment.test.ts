import { describe, expect, it } from 'vitest'
import {
  calculatePaymentPreview,
  getTodayInSaoPaulo,
  hasValidCentPrecision,
  isAmbiguousMutationError,
  isISODate,
  isMutationConflictError,
  parsePaymentFilters,
  validatePaymentDateRange,
} from './payment'
import { AxiosError } from 'axios'

describe('payment helpers', () => {
  it('validates real ISO civil dates', () => {
    expect(isISODate('2026-02-28')).toBe(true)
    expect(isISODate('2026-02-30')).toBe(false)
    expect(isISODate(['2026-02-28'])).toBe(false)
  })

  it('uses America/Sao_Paulo for today', () => {
    expect(getTodayInSaoPaulo(new Date('2026-08-12T01:30:00Z'))).toBe('2026-08-11')
  })

  it('normalizes URL filters and drops invalid values', () => {
    expect(parsePaymentFilters({ clientId: '7', dateFrom: '2026-08-01', status: 'posted' })).toEqual({
      clientId: 7,
      dateFrom: '2026-08-01',
      status: 'posted',
    })
    expect(parsePaymentFilters({ clientId: '0', dateFrom: 'bad', status: 'unknown' })).toEqual({})
  })

  it('validates date range ordering', () => {
    expect(validatePaymentDateRange('2026-08-01', '2026-08-31')).toBe(true)
    expect(validatePaymentDateRange('2026-09-01', '2026-08-31')).toBe(false)
    expect(validatePaymentDateRange('2026-01-01', '2027-01-03')).toBe(false)
    expect(hasValidCentPrecision(0.29)).toBe(true)
    expect(hasValidCentPrecision(0.291)).toBe(false)
  })

  it('previews debt, settlement and credit using currency arithmetic', () => {
    const debt = { position: 'debt' as const, netBalance: 100, debtAmount: 100, creditAmount: 0 }
    expect(calculatePaymentPreview(debt, 40)).toMatchObject({ position: 'debt', debtAmount: 60 })
    expect(calculatePaymentPreview(debt, 100)).toMatchObject({ position: 'settled', netBalance: 0 })
    expect(calculatePaymentPreview(debt, 150)).toMatchObject({ position: 'credit', creditAmount: 50 })
  })

  it('distinguishes ambiguous transport/server failures from rejected requests', () => {
    expect(isAmbiguousMutationError(new AxiosError('network'))).toBe(true)
    expect(
      isAmbiguousMutationError(new AxiosError('server', undefined, undefined, undefined, { status: 502 } as never))
    ).toBe(true)
    expect(
      isAmbiguousMutationError(new AxiosError('invalid', undefined, undefined, undefined, { status: 422 } as never))
    ).toBe(false)
    expect(isAmbiguousMutationError(new Error('local'))).toBe(false)
    expect(
      isMutationConflictError(new AxiosError('conflict', undefined, undefined, undefined, { status: 409 } as never))
    ).toBe(true)
    expect(
      isMutationConflictError(new AxiosError('invalid', undefined, undefined, undefined, { status: 422 } as never))
    ).toBe(false)
  })
})
