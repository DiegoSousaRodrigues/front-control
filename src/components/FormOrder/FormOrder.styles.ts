import { w } from 'windstitch'

export const Wrapper = w.div('px-4 py-6 sm:px-8 lg:px-12 flex flex-col gap-6')
export const Title = w.strong('text-base font-semibold')
export const Form = w.form('flex flex-col gap-5')
export const FieldsRow = w.div(
  'grid grid-cols-1 gap-4 md:grid-cols-[minmax(190px,1.2fr)_minmax(160px,.7fr)_minmax(220px,1fr)]'
)
export const Field = w.div('flex flex-col min-w-0 gap-1')
export const BalanceCard = w.section('overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm')
export const BalanceState = w.div(
  'flex min-h-16 items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-sm text-gray-600'
)
export const BalanceSuccess = w.div('grid grid-cols-1 md:grid-cols-[1fr_1.15fr_1fr_1.15fr]')
export const FinancialSegment = w.div(
  'flex min-h-[86px] flex-col justify-center gap-1 border-t border-gray-200 px-4 py-4 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0'
)
export const PaymentSegment = w.div(
  'flex min-h-[86px] flex-col justify-center border-t border-gray-200 px-4 py-3 md:border-l md:border-t-0'
)
export const Receivable = w.div(
  'flex min-h-[86px] flex-col justify-center gap-1 border-t border-gray-200 bg-gray-50 px-4 py-4 md:border-l md:border-t-0'
)
export const BalanceLabel = w.span('text-xs font-medium text-gray-500')
export const BalanceValue = w.strong('text-xl font-semibold tabular-nums text-primary')
export const SummaryLabel = w.span('text-xs font-medium text-gray-500')
export const SummaryValue = w.strong('text-lg font-semibold tabular-nums')
export const SummaryHint = w.span('text-xs text-gray-500')
export const ItemsSection = w.div('flex flex-col gap-3 border-t border-gray-200 pt-5')
export const ButtonsRow = w.div('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end')
export const AddButton = w.button('w-full rounded-lg border border-primary py-2 px-4 text-primary sm:w-auto')
export const SubmitButton = w.button(
  'w-full rounded-lg bg-primary py-2 px-4 text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
)
