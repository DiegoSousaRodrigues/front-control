import { w } from 'windstitch'

export const Wrapper = w.label('flex flex-col')

export const Label = w.span('text-xs text-primary px-2')

export const InputComponent = w.input(
  'border border-solid border-gray-200 rounded-md w-full py-2 px-4 hover:border-primary focus-visible:outline-none focus:border-primary'
)
