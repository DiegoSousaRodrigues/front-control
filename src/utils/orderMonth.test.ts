import { describe, expect, it } from 'vitest'
import {
  formatOrderPeriod,
  getCurrentOrderMonth,
  getPreviousOrderPeriod,
  isFutureOrderPeriod,
  parseOrderMonth,
  parseOrderPeriod,
} from './orderMonth'

describe('order month utilities', () => {
  it('uses the America/Sao_Paulo calendar month', () => {
    expect(getCurrentOrderMonth(new Date('2026-09-01T01:00:00Z'))).toBe('2026-08')
  })

  it.each(['2026-00', '2026-13', '26-08', '2026-8'])('rejects invalid month %s', (value) => {
    expect(parseOrderMonth(value)).toBeNull()
  })

  it('parses query params and blocks future periods', () => {
    expect(parseOrderPeriod('2026', '8')).toEqual({ year: 2026, month: 8 })
    expect(isFutureOrderPeriod({ year: 2026, month: 9 }, '2026-08')).toBe(true)
    expect(isFutureOrderPeriod({ year: 2026, month: 8 }, '2026-08')).toBe(false)
  })

  it('formats legacy and known periods', () => {
    expect(formatOrderPeriod(null, null)).toBe('—')
    expect(formatOrderPeriod(2026, 8)).toBe('08/2026')
  })

  it('resolves the previous month across the year boundary', () => {
    expect(getPreviousOrderPeriod({ year: 2026, month: 1 })).toEqual({ year: 2025, month: 12 })
    expect(getPreviousOrderPeriod({ year: 2026, month: 8 })).toEqual({ year: 2026, month: 7 })
  })
})
