import { Controller } from 'react-hook-form'
import { OrderSkuLineProps } from './OrderSkuLine.types'
import Select from '../Select'
import { Input } from '../Input/Input'
import { MdDelete } from 'react-icons/md'
import { useState } from 'react'

export function OrderSkuLine({ index, control, mockProducts, removeProduct, productId }: OrderSkuLineProps) {
  const [price, setPrice] = useState<number>()
  const defaultPriceString = mockProducts.find(({ value }) => value == productId)?.price
  const { _getWatch } = control
  const quantity = _getWatch(`products.${index}.quantity`)

  function updatePrice() {
    setPrice(150 * quantity)
  }

  const { register } = control
  return (
    <div className='flex gap-4 items-end'>
      <div className='w-1/4'>
        <Controller
          control={control}
          name={`products.${index}.productId`}
          render={({ field: { value, onChange } }) => (
            <Select label='Produto' items={mockProducts} value={value} onChange={onChange} addIndexZero />
          )}
        />
      </div>
      <div className='w-1/4'>
        <Input label='Quantidade' mask='number-only' maxLength={4} {...register(`products.${index}.quantity`)} />
      </div>
      <div className='w-1/4'>
        <Input label='Preço' value={price} disabled />
      </div>
      <button type='button' onClick={removeProduct(index)} className='rounded-full h-[40px] flex items-center'>
        <MdDelete size={24} className='fill-primary' />
      </button>
    </div>
  )
}
