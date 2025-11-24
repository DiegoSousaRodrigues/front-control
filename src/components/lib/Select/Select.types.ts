/* eslint-disable @typescript-eslint/no-explicit-any */
export type SelectProps = {
  label: string
  items: { label: string; value: string | number }[]
  value: string | number
  defaultValue: string | undefined
  onChange: (...event: any[]) => void
  disabled?: boolean
}
