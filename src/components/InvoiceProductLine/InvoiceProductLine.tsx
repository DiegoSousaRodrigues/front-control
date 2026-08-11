import { InvoiceFormData } from '@/types/invoice'
import { OrderProductOption, calculateOrderLineTotal } from '@/utils/orderTotals'
import { numberToBRLString } from '@/utils/currency'
import { Control, Controller, useFormState, useWatch } from 'react-hook-form'
import { MdDelete } from 'react-icons/md'
import { Input } from '../lib/Input/Input'
import Message from '../lib/Message'
import Select from '../lib/Select'
import { DeleteButton, Field, ProductRow } from '../OrderSkuLine/OrderSkuLine.styles'

export function InvoiceProductLine({
  index,
  control,
  products,
  remove,
}: {
  index: number
  control: Control<InvoiceFormData>
  products: OrderProductOption[]
  remove: () => void
}) {
  const productId = useWatch({ control, name: `products.${index}.productId` })
  const quantity = useWatch({ control, name: `products.${index}.quantity` })
  const { errors } = useFormState({ control, name: [`products.${index}.productId`, `products.${index}.quantity`] })
  const total = calculateOrderLineTotal(productId, quantity, products)
  return (
    <ProductRow>
      <Field>
        <Controller
          control={control}
          name={`products.${index}.productId`}
          rules={{ required: 'Selecione um produto' }}
          render={({ field }) => (
            <Select label='Produto' items={products} value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.products?.[index]?.productId && <Message>{errors.products[index].productId.message}</Message>}
      </Field>
      <Field>
        <Controller
          control={control}
          name={`products.${index}.quantity`}
          rules={{
            required: 'Informe a quantidade',
            validate: (value) => (Number.isSafeInteger(Number(value)) && Number(value) > 0) || 'Quantidade inválida',
          }}
          render={({ field }) => (
            <Input label='Quantidade' mask='number-only' maxLength={10} value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.products?.[index]?.quantity && <Message>{errors.products[index].quantity.message}</Message>}
      </Field>
      <Field>
        <Input label='Total da linha' value={numberToBRLString(total)} disabled />
      </Field>
      <DeleteButton type='button' onClick={remove} aria-label={`Remover produto ${index + 1}`}>
        <MdDelete size={22} className='fill-primary' />
      </DeleteButton>
    </ProductRow>
  )
}
