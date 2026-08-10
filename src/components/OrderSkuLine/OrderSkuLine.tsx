import { Controller, useFormState, useWatch } from 'react-hook-form'
import { OrderSkuLineProps } from './OrderSkuLine.types'
import Select from '../lib/Select'
import { Input } from '../lib/Input/Input'
import { MdDelete } from 'react-icons/md'
import { numberToBRLString } from '@/utils/currency'
import Message from '../lib/Message'
import { calculateOrderLineTotal } from '@/utils/orderTotals'
import { DeleteButton, Field, ProductRow } from './OrderSkuLine.styles'

export function OrderSkuLine({ index, control, products, removeProduct }: OrderSkuLineProps) {
  const productId = useWatch({ control, name: `products.${index}.productId` })
  const quantity = useWatch({ control, name: `products.${index}.quantity` })
  const { errors } = useFormState({ control, name: [`products.${index}.productId`, `products.${index}.quantity`] })
  const lineTotal = calculateOrderLineTotal(productId, quantity, products)

  return (
    <ProductRow>
      <Field>
        <Controller
          control={control}
          name={`products.${index}.productId`}
          rules={{ required: 'Campo obrigatório' }}
          render={({ field: { value, onChange } }) => (
            <Select label='Produto' items={products} value={value} onChange={onChange} />
          )}
        />
        {errors.products?.[index]?.productId && <Message>{errors.products[index].productId.message}</Message>}
      </Field>
      <Field>
        <Controller
          control={control}
          name={`products.${index}.quantity`}
          rules={{
            required: 'Campo obrigatório',
            validate: (value) => (Number.isSafeInteger(Number(value)) && Number(value) > 0) || 'Quantidade inválida',
          }}
          render={({ field: { value, onChange } }) => (
            <Input label='Quantidade' mask='number-only' maxLength={4} value={value} onChange={onChange} />
          )}
        />
        {errors.products?.[index]?.quantity && <Message>{errors.products[index].quantity.message}</Message>}
      </Field>
      <Field>
        <Input label='Preço' value={numberToBRLString(lineTotal)} disabled />
      </Field>
      <DeleteButton type='button' onClick={removeProduct(index)} aria-label='Remover produto' title='Remover produto'>
        <MdDelete size={22} className='fill-primary' />
      </DeleteButton>
    </ProductRow>
  )
}
