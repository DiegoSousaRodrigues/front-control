const ORDER_TIME_ZONE = 'America/Sao_Paulo'
const ORDER_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

export type OrderPeriod = { year: number; month: number }

export function getCurrentOrderMonth(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ORDER_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date)
  const year = parts.find(({ type }) => type === 'year')?.value
  const month = parts.find(({ type }) => type === 'month')?.value
  return `${year}-${month}`
}

export function parseOrderMonth(value: unknown): OrderPeriod | null {
  if (typeof value !== 'string') return null
  const match = ORDER_MONTH_PATTERN.exec(value)
  return match ? { year: Number(match[1]), month: Number(match[2]) } : null
}

export function parseOrderPeriod(year: unknown, month: unknown): OrderPeriod | null {
  const yearValue = typeof year === 'string' && /^\d{4}$/.test(year) ? Number(year) : null
  const monthValue = typeof month === 'string' && /^(?:[1-9]|1[0-2])$/.test(month) ? Number(month) : null
  return yearValue && monthValue ? { year: yearValue, month: monthValue } : null
}

export function isFutureOrderPeriod(period: OrderPeriod, currentMonth = getCurrentOrderMonth()): boolean {
  const current = parseOrderMonth(currentMonth)
  return current ? period.year * 12 + period.month > current.year * 12 + current.month : false
}

export function formatOrderPeriod(year: number | null, month: number | null): string {
  if (!year || !month) return '—'
  return `${String(month).padStart(2, '0')}/${year}`
}

export function getPreviousOrderPeriod(period: OrderPeriod): OrderPeriod {
  return period.month === 1 ? { year: period.year - 1, month: 12 } : { year: period.year, month: period.month - 1 }
}
