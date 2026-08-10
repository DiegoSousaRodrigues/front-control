import { addCurrency, multiplyCurrency } from './currency'

export type OrderProductOption = {
  value: string
  label: string
  salePrice: number
}

export function calculateOrderLineTotal(
  productId: string | number | undefined,
  quantity: string | number | undefined,
  products: OrderProductOption[]
): number {
  const product = products.find(({ value }) => value === String(productId ?? ''))
  const numericQuantity = Number(quantity)
  if (!product || !Number.isSafeInteger(numericQuantity) || numericQuantity <= 0) return 0
  return multiplyCurrency(product.salePrice, numericQuantity)
}

export function calculateCurrentOrderTotal(
  selectedProducts: { productId: string; quantity: string }[],
  products: OrderProductOption[]
): number {
  return selectedProducts.reduce(
    (total, item) => addCurrency(total, calculateOrderLineTotal(item.productId, item.quantity, products)),
    0
  )
}
