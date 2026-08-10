import { describe, expect, it } from 'vitest'
import { createOrderRequest, createOrderResetValues } from './orderRequest'

describe('createOrderRequest', () => {
  const form = {
    clientId: '7',
    orderPeriod: '2026-08',
    previousMonthPayment: 'R$ 12,34',
    observation: 'Teste',
    products: [{ productId: '3', quantity: '2' }],
  }

  it('creates only the numeric logical payload', () => {
    expect(createOrderRequest(form, 20)).toEqual({
      clientId: 7,
      orderYear: 2026,
      orderMonth: 8,
      previousMonthPayment: 12.34,
      observation: 'Teste',
      products: [{ productId: 3, quantity: 2 }],
    })
  })

  it('never includes calculated balance fields and rejects overpayment', () => {
    expect(createOrderRequest(form, 10)).toBeNull()
  })
})

describe('createOrderResetValues', () => {
  it('clears normal mode fields and preserves the selected period', () => {
    expect(createOrderResetValues('', '2026-08')).toEqual({
      clientId: '',
      orderPeriod: '2026-08',
      previousMonthPayment: '',
      observation: '',
      products: [],
    })
  })

  it('keeps the next client selected in sequence mode', () => {
    expect(createOrderResetValues('9', '2026-08')).toEqual({
      clientId: '9',
      orderPeriod: '2026-08',
      previousMonthPayment: 'R$ 0,00',
      observation: '',
      products: [],
    })
  })
})
