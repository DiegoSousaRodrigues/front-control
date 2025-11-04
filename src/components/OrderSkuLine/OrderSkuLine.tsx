/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'
import { OrderSkuLineProps } from './OrderSkuLine.types'
import Select from '../Select'
import { Input } from '../Input/Input'
import { MdDelete } from 'react-icons/md'
import { useState, ChangeEvent } from 'react'
import { BRLStringToNumber, numberToBRLString } from '@/utils/currency'

export function OrderSkuLine({ index, control, products, removeProduct, getValues }: OrderSkuLineProps) {
  const [price, setPrice] = useState<string>()

  function handleUpdatePrice(cb: (...event: any[]) => void) {
    return (eventOrValue: ChangeEvent<HTMLInputElement> | string | number) => {
      cb(eventOrValue)
      const productId = getValues(`products.${index}.productId`)
      updatePrice(productId)
    }
  }

  function updatePrice(productId: string | number) {
    const defaultPriceString = products.find(({ value }) => String(value) === productId)?.price
    const priceNumber = BRLStringToNumber(defaultPriceString)
    const quantity = getValues(`products.${index}.quantity`)

    setPrice(numberToBRLString(priceNumber * quantity))
  }

  return (
    <div className='flex gap-4 items-end'>
      <div className='w-1/4'>
        <Controller
          control={control}
          name={`products.${index}.productId`}
          render={({ field: { value, onChange } }) => (
            <Select label='Produto' items={products} value={value} onChange={handleUpdatePrice(onChange)} />
          )}
        />
      </div>
      <div className='w-1/4'>
        <Controller
          control={control}
          name={`products.${index}.quantity`}
          render={({ field: { value, onChange } }) => (
            <Input
              label='Quantidade'
              mask='number-only'
              maxLength={4}
              value={value}
              onChange={handleUpdatePrice(onChange)}
            />
          )}
        />
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
