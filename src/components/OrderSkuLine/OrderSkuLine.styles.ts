import { w } from 'windstitch'

export const ProductRow = w.div(
  'grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-white p-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(110px,.45fr)_minmax(150px,.7fr)_32px] sm:items-start'
)
export const Field = w.div('flex min-w-0 flex-col gap-1')
export const DeleteButton = w.button(
  'flex h-[38px] w-8 items-center justify-center rounded-md sm:mt-[14px] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'
)
