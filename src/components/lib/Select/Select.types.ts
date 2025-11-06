/* eslint-disable @typescript-eslint/no-explicit-any */
export type SelectProps = {
  label: string
  items: { label: string; value: string | number }[]
  value: string | number
  onChange: (...event: any[]) => void
}
