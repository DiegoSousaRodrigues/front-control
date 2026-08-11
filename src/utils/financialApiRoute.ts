import { PaymentCreateRequest, PaymentListFilters, PaymentReverseRequest } from '@/types/payment'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  hasValidCentPrecision,
  isISODate,
  isPaymentStatus,
  maxFinancialAmount,
  validatePaymentDateRange,
} from './payment'
import { parsePositiveId } from './positiveId'

const allowedPaymentFields = new Set(['clientId', 'amount', 'effectiveDate', 'observation'])
const allowedPaymentListQuery = new Set(['clientId', 'dateFrom', 'dateTo', 'status', 'cursor', 'limit'])
const allowedStatementQuery = new Set(['id', 'dateTo', 'cursor', 'limit'])
const opaqueCursorPattern = /^[A-Za-z0-9_-]+$/

export function allowMethod(req: NextApiRequest, res: NextApiResponse, method: 'GET' | 'POST'): boolean {
  if (req.method === method) return true
  res.setHeader('Allow', [method])
  res.status(405).json({ error: 'Method not allowed' })
  return false
}

export function isSameOriginMutation(req: NextApiRequest): boolean {
  const source = req.headers.origin || req.headers.referer
  const host = req.headers.host || req.headers['x-forwarded-host']
  if (!source || !host || Array.isArray(host)) return false
  try {
    return new URL(source).host === host
  } catch {
    return false
  }
}

export function hasJSONContentType(req: NextApiRequest): boolean {
  const contentType = req.headers['content-type']
  return typeof contentType === 'string' && contentType.split(';', 1)[0].trim().toLowerCase() === 'application/json'
}

export function parsePaymentCreateBody(body: unknown, today: string): PaymentCreateRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const value = body as Record<string, unknown>
  if (Object.keys(value).some((key) => !allowedPaymentFields.has(key))) return null
  const clientId = parsePositiveId(value.clientId)
  if (!clientId || typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount <= 0) return null
  if (!hasValidCentPrecision(value.amount) || value.amount > maxFinancialAmount) return null
  if (!isISODate(value.effectiveDate) || value.effectiveDate > today) return null
  if (value.observation !== undefined && value.observation !== null && typeof value.observation !== 'string')
    return null
  const observation = typeof value.observation === 'string' ? value.observation.trim() : null
  if (observation && observation.length > 1000) return null
  return { clientId, amount: value.amount, effectiveDate: value.effectiveDate, observation: observation || null }
}

export function parsePaymentReverseBody(body: unknown): PaymentReverseRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const value = body as Record<string, unknown>
  if (Object.keys(value).some((key) => key !== 'reason') || typeof value.reason !== 'string') return null
  const reason = value.reason.trim()
  return reason && reason.length <= 1000 ? { reason } : null
}

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function isValidOpaqueCursor(value: string | undefined): boolean {
  return value === undefined || (value.length > 0 && value.length <= 2048 && opaqueCursorPattern.test(value))
}

export function parsePaymentListQuery(query: NextApiRequest['query']): PaymentListFilters | null {
  if (Object.keys(query).some((key) => !allowedPaymentListQuery.has(key))) return null
  if (['clientId', 'dateFrom', 'dateTo', 'status', 'cursor', 'limit'].some((key) => Array.isArray(query[key])))
    return null
  const clientRaw = single(query.clientId)
  const clientId = clientRaw ? parsePositiveId(clientRaw) : null
  if (clientRaw && !clientId) return null
  const dateFrom = single(query.dateFrom)
  const dateTo = single(query.dateTo)
  const status = single(query.status)
  const cursor = single(query.cursor)
  const limitRaw = single(query.limit)
  if (
    (dateFrom && !isISODate(dateFrom)) ||
    (dateTo && !isISODate(dateTo)) ||
    !validatePaymentDateRange(dateFrom, dateTo)
  )
    return null
  if (status && !isPaymentStatus(status)) return null
  if (!isValidOpaqueCursor(cursor)) return null
  const canonicalStatus = isPaymentStatus(status) ? status : undefined
  const limit = limitRaw ? Number(limitRaw) : undefined
  if (limitRaw && (!Number.isSafeInteger(limit) || Number(limit) < 1 || Number(limit) > 100)) return null
  return {
    ...(clientId ? { clientId } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(canonicalStatus ? { status: canonicalStatus } : {}),
    ...(cursor ? { cursor } : {}),
    ...(limit ? { limit } : {}),
  }
}

export function parseStatementQuery(query: NextApiRequest['query']) {
  if (Object.keys(query).some((key) => !allowedStatementQuery.has(key))) return null
  if (['id', 'dateTo', 'cursor', 'limit'].some((key) => Array.isArray(query[key]))) return null
  const id = parsePositiveId(query.id)
  const dateTo = single(query.dateTo)
  const cursor = single(query.cursor)
  const limitRaw = single(query.limit)
  const limit = limitRaw ? Number(limitRaw) : undefined
  if (
    !id ||
    (dateTo && !isISODate(dateTo)) ||
    !isValidOpaqueCursor(cursor) ||
    (limitRaw && (!Number.isSafeInteger(limit) || Number(limit) < 1 || Number(limit) > 100))
  )
    return null
  return { id, filters: { ...(dateTo ? { dateTo } : {}), ...(cursor ? { cursor } : {}), ...(limit ? { limit } : {}) } }
}
