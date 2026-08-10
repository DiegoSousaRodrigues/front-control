import { dinero, multiply, toDecimal } from 'dinero.js'
import { BRL } from 'dinero.js/currencies'

export function BRLStringToNumber(brlString: string | null | undefined): number {
  if (!brlString) {
    return NaN
  }

  const cleanedString = brlString.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')

  return Number(cleanedString)
}

export function numberToBRLString(numberValue: number | null | undefined): string {
  if (numberValue === null || numberValue === undefined || !Number.isFinite(numberValue)) {
    return 'R$ 0,00'
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

  const value = dinero({ amount: Math.round(numberValue * 100), currency: BRL })
  return toDecimal(value, ({ value: decimalValue }) => formatter.format(Number(decimalValue)).replace(/\u00a0/g, ' '))
}

export function nullableNumberToBRLString(numberValue: number | null): string {
  return numberValue === null ? '—' : numberToBRLString(numberValue)
}

export function multiplyCurrency(numberValue: number, multiplier: number): number {
  if (!Number.isFinite(numberValue) || !Number.isSafeInteger(multiplier) || multiplier < 0) {
    return NaN
  }

  const value = dinero({ amount: Math.round(numberValue * 100), currency: BRL })
  return toDecimal(multiply(value, multiplier), ({ value: decimalValue }) => Number(decimalValue))
}
