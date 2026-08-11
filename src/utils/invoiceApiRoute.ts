import { InvoiceCancelRequest, InvoiceIssueRequest, InvoiceListFilters } from '@/types/invoice'
import { isFutureOrderPeriod, parseOrderPeriod } from './orderMonth'
import { parsePositiveId } from './positiveId'

const issueFields = new Set(['clientId', 'year', 'month', 'observation', 'products'])
const listQueryFields = new Set(['year', 'month', 'clientId', 'cursor', 'limit'])
const idQueryFields = new Set(['id'])
const opaqueCursorPattern = /^[A-Za-z0-9_-]+$/

function hasOnlyFields(value: Record<string, unknown>, allowed: Set<string>): boolean {
  return !Object.keys(value).some((key) => !allowed.has(key))
}

function isValidOpaqueCursor(value: string | undefined): boolean {
  return value === undefined || (value.length > 0 && value.length <= 2048 && opaqueCursorPattern.test(value))
}

export function parseInvoiceIssueBody(body: unknown): InvoiceIssueRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const value = body as Record<string, unknown>
  if (Object.keys(value).some((key) => !issueFields.has(key))) return null
  if (typeof value.clientId !== 'number' || typeof value.year !== 'number' || typeof value.month !== 'number') return null
  const clientId = parsePositiveId(value.clientId)
  const period = parseOrderPeriod(String(value.year), String(value.month))
  if (
    !clientId ||
    !period ||
    isFutureOrderPeriod(period) ||
    !Array.isArray(value.products) ||
    value.products.length === 0 ||
    value.products.length > 500
  )
    return null
  const products = value.products.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null
    const product = item as Record<string, unknown>
    if (Object.keys(product).some((key) => !['productId', 'quantity'].includes(key))) return null
    if (typeof product.productId !== 'number' || typeof product.quantity !== 'number') return null
    const productId = parsePositiveId(product.productId)
    const quantity = product.quantity
    return productId && Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 2_147_483_647
      ? { productId, quantity }
      : null
  })
  if (products.some((item) => !item)) return null
  const canonicalProducts = products as { productId: number; quantity: number }[]
  if (new Set(canonicalProducts.map(({ productId }) => productId)).size !== canonicalProducts.length) return null
  if (value.observation !== undefined && value.observation !== null && typeof value.observation !== 'string')
    return null
  const observation = typeof value.observation === 'string' ? value.observation.trim() : null
  if (observation && observation.length > 1000) return null
  return {
    clientId,
    year: period.year,
    month: period.month,
    observation: observation || null,
    products: canonicalProducts,
  }
}

export function parseInvoiceCancelBody(body: unknown): InvoiceCancelRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const value = body as Record<string, unknown>
  if (Object.keys(value).some((key) => key !== 'reason') || typeof value.reason !== 'string') return null
  const reason = value.reason.trim()
  return reason && reason.length <= 1000 ? { reason } : null
}

function single(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined
}
export function parseInvoiceListQuery(query: Record<string, string | string[] | undefined>): InvoiceListFilters | null {
  if (!hasOnlyFields(query, listQueryFields)) return null
  if (['year', 'month', 'clientId', 'cursor', 'limit'].some((key) => Array.isArray(query[key]))) return null
  const period = parseOrderPeriod(single(query.year), single(query.month))
  if (!period || isFutureOrderPeriod(period)) return null
  const clientRaw = single(query.clientId)
  const clientId = clientRaw ? parsePositiveId(clientRaw) : null
  if (clientRaw && !clientId) return null
  const limitRaw = single(query.limit)
  const limit = limitRaw ? Number(limitRaw) : undefined
  if (limitRaw && (!Number.isSafeInteger(limit) || Number(limit) < 1 || Number(limit) > 100)) return null
  const cursor = single(query.cursor)
  if (!isValidOpaqueCursor(cursor)) return null
  return { ...period, ...(clientId ? { clientId } : {}), ...(cursor ? { cursor } : {}), ...(limit ? { limit } : {}) }
}

export function parseInvoiceIDQuery(query: Record<string, string | string[] | undefined>): number | null {
  if (!hasOnlyFields(query, idQueryFields) || Array.isArray(query.id)) return null
  return parsePositiveId(query.id)
}

export function hasEmptyInvoiceQuery(query: Record<string, string | string[] | undefined>): boolean {
  return Object.keys(query).length === 0
}
