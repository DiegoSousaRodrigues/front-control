import * as ToastPrimitive from '@radix-ui/react-toast'
import styled from 'windstitch'

export const Provider = styled(ToastPrimitive.Provider, {
  className: '',
})

export const Root = styled(ToastPrimitive.Root, {
  className:
    'flex items-center font-bold leading-[1.3] text-white rounded-md p-4 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]',
  variants: {
    type: {
      success: 'bg-success',
      error: 'bg-error',
      warning: 'bg-warning',
    },
  },
  defaultVariants: { type: 'warning' },
})

export const Description = styled(ToastPrimitive.Description, {})

export const Viewport = styled(ToastPrimitive.Viewport, {
  className:
    'fixed top-4 right-4 z-[2147483647] m-0 flex w-[250px] max-w-[100vw] list-none flex-col gap-2 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"',
})
