export function resolveSelectValue(
  _items: { label: string; value: string | number }[],
  value: string | number | null | undefined
): string {
  return value === null || value === undefined ? '' : String(value)
}
