export function BRLStringToNumber(brlString: string | null | undefined): number {
  if (!brlString) {
    return NaN
  }

  const cleanedString = brlString.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')

  const numberValue = parseFloat(cleanedString)

  return numberValue
}

export function numberToBRLString(numberValue: number | null | undefined): string {
  if (numberValue === null || numberValue === undefined || isNaN(numberValue)) {
    return 'R$ 0,00'
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

  return formatter.format(numberValue)
}
