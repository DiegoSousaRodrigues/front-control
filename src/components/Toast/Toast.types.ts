import { ToastProps as RadixToastProps } from '@radix-ui/react-toast'

export type ToastProps = {
  description: string
  status: 'warning' | 'success' | 'error'
} & Omit<RadixToastProps, 'type'>

export type ToastEventProps = {
  description: string
  status: 'warning' | 'success' | 'error'
}
