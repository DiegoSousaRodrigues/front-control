import { InputHTMLAttributes } from 'react'
import { Mask } from './mask'

export type InputProps = {
  label?: string
  mask?: Mask | ((v: string) => string)
} & InputHTMLAttributes<HTMLInputElement>
