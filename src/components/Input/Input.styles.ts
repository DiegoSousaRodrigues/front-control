import { w } from 'windstitch'

export const Wrapper = w.label('flex flex-col', {
  variants: { disabled: (disabled: boolean) => (disabled ? 'opacity-50 cursor-not-allowed' : '') },
  defaultVariants: { disabled: false },
})

export const Label = w.span('text-xs text-primary px-2')

const hoverAndFocus = 'hover:border-primary focus-visible:outline-none focus:border-primary'
const disabled = 'disabled:cursor-not-allowed disabled:border-gray-300'
export const InputElement = w.input(
  `h-[38px] border border-solid border-gray-200 rounded-lg w-full py-2 px-4 ${hoverAndFocus} ${disabled}`
)
