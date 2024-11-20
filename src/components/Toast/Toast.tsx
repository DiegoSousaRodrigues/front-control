import { ToastProviderProps } from '@radix-ui/react-toast'
import { Description, Provider, Root, Viewport } from './Toast.styles'
import { ToastProps } from './Toast.types'

export function Toast({ description, status, ...props }: ToastProps) {
  return (
    <Root {...props} type={status}>
      <Description>{description}</Description>
    </Root>
  )
}

Toast.Provider = function ProviderComponent({ children, ...props }: ToastProviderProps) {
  return (
    <Provider swipeDirection='right' {...props}>
      {children}
      <Viewport />
    </Provider>
  )
}
