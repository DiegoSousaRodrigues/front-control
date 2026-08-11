import { describe, expect, it } from 'vitest'
import {
  buildClientBalanceQuery,
  formatClientBalanceMonth,
  getMissingCostMessage,
  getProfitStatus,
  getProfitStatusLabel,
  resolveClientBalanceViewState,
  shouldFetchClientBalance,
  toClientBalancePresentation,
} from './clientBalance'

describe('client balance presentation', () => {
  it('preserves other URL filters while selecting or clearing the client', () => {
    expect(buildClientBalanceQuery({ source: 'menu', clientId: '7' }, 9)).toEqual({ source: 'menu', clientId: '9' })
    expect(buildClientBalanceQuery({ source: 'menu', clientId: 'invalid' }, null)).toEqual({ source: 'menu' })
  })

  it('only enables the report query after the router is ready with a valid client', () => {
    expect(shouldFetchClientBalance(false, 7)).toBe(false)
    expect(shouldFetchClientBalance(true, null)).toBe(false)
    expect(shouldFetchClientBalance(true, 7)).toBe(true)
  })

  it('does not enter a remote state without a selected client', () => {
    expect(resolveClientBalanceViewState({ clientId: null, isLoading: true, isError: false })).toBe('initial')
  })

  it.each([
    [{ clientId: 7, isLoading: true, isError: false }, 'loading'],
    [{ clientId: 7, isLoading: false, isError: true }, 'error'],
    [{ clientId: 7, isLoading: false, isError: false, monthCount: 0 }, 'empty'],
    [{ clientId: 7, isLoading: false, isError: false, monthCount: 2 }, 'success'],
  ] as const)('resolves report state %#', (input, expected) => {
    expect(resolveClientBalanceViewState(input)).toBe(expected)
  })

  it('labels legacy rows without inventing a competence', () => {
    expect(formatClientBalanceMonth(null, null)).toBe('Sem competência (legado)')
    expect(formatClientBalanceMonth(2026, 8)).toBe('08/2026')
  })

  it.each([
    [null, 'unavailable', 'Indisponível'],
    [12.5, 'positive', 'Positivo'],
    [-2, 'negative', 'Negativo'],
    [0, 'zero', 'Zero'],
  ] as const)('describes profit %s without relying only on color', (value, status, label) => {
    expect(getProfitStatus(value)).toBe(status)
    expect(getProfitStatusLabel(status)).toBe(label)
  })

  it('uses singular and plural in the incomplete-cost warning', () => {
    expect(getMissingCostMessage(1)).toContain('1 item não possui')
    expect(getMissingCostMessage(3)).toContain('3 itens não possuem')
  })

  it('maps the v2 invoice contract without inventing incomplete costs', () => {
    const presentation = toClientBalancePresentation(
      {
        client: { id: 7, name: 'Cliente', active: true },
        totals: {
          invoiceCount: 2,
          quantityTotal: 5,
          purchaseTotal: 10,
          saleTotal: 20,
          profitTotal: 10,
        },
        months: [
          {
            year: 2026,
            month: 8,
            invoiceCount: 2,
            quantityTotal: 5,
            purchaseTotal: 10,
            saleTotal: 20,
            profitTotal: 10,
          },
        ],
      },
      true
    )

    expect(presentation.recordLabel).toBe('Faturas')
    expect(presentation.totals).toMatchObject({ recordCount: 2, costComplete: true, missingCostItemCount: 0 })
    expect(presentation.months[0]).toMatchObject({ recordCount: 2, year: 2026, month: 8, costComplete: true })
  })

  it('preserves nullable historical costs in the legacy order contract', () => {
    const presentation = toClientBalancePresentation(
      {
        client: { id: 7, name: 'Cliente', active: true },
        totals: {
          orderCount: 1,
          quantityTotal: 2,
          purchaseTotal: null,
          saleTotal: 20,
          profitTotal: null,
          costComplete: false,
          missingCostItemCount: 1,
        },
        months: [
          {
            year: null,
            month: null,
            orderCount: 1,
            quantityTotal: 2,
            purchaseTotal: null,
            saleTotal: 20,
            profitTotal: null,
            costComplete: false,
            missingCostItemCount: 1,
          },
        ],
      },
      false
    )

    expect(presentation.recordLabel).toBe('Pedidos')
    expect(presentation.totals).toMatchObject({ purchaseTotal: null, costComplete: false, missingCostItemCount: 1 })
    expect(presentation.months[0]).toMatchObject({ recordCount: 1, year: null, month: null, costComplete: false })
  })
})
