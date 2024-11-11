import { w } from 'windstitch'

export const Wrapper = w.div('px-12 py-8 flex flex-col gap-6')

export const Title = w.strong('')

export const Form = w.form('flex flex-col gap-4')

export const FlexInputs = w.div('flex flex-wrap gap-4')

export const WrapperInputs = w.div('min-w-[200px]', {
  variants: {
    quantity: {
      3: 'w-[calc((100%_/_3)_-_11px)]',
      5: 'w-[calc((100%_/_5)_-_13px)]',
    },
  },
  defaultVariants: { quantity: 5 },
})

export const Button = w.button('py-4 rounded-md bg-primary text-white font-bold')
