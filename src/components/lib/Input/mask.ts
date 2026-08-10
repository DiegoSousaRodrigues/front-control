const cepMask = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{8})\d+?$/, '$1')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d/, '$1')

const celMask = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{11})\d+?$/, '$1')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2')

const dateMask = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1')

const letterOnlyMask = (value: string) => value.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, '')

const numberOnlyMask = (value: string) => value.replace(/\D/g, '')

const cityCepMask = (value: string) => (RegExp(/\d/).test(value) ? cepMask(value) : value)

const cpfMask = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .slice(0, 14)

const currencyMask = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '') || '0'
  const paddedDigits = digits.padStart(3, '0')
  const integerPart = paddedDigits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const cents = paddedDigits.slice(-2)

  return `R$ ${integerPart},${cents}`
}

const maskMap = new Map<Mask, (value: string) => string>([
  ['cep', cepMask],
  ['cel', celMask],
  ['date', dateMask],
  ['letter-only', letterOnlyMask],
  ['number-only', numberOnlyMask],
  ['city-cep', cityCepMask],
  ['cpf', cpfMask],
  ['currency', currencyMask],
])

export function inputMask(value: string, mask: Mask) {
  if (maskMap.has(mask)) {
    return (maskMap.get(mask) as (value: string) => string)(value)
  }
  return value
}

export type Mask = 'cep' | 'cel' | 'date' | 'letter-only' | 'number-only' | 'city-cep' | 'cpf' | 'currency'
