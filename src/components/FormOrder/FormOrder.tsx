/* eslint-disable react-hooks/exhaustive-deps */
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '../Input/Input'
import Select from '../Select'
import { Title, Wrapper } from './FormOrder.styles'
import { OrderData } from './FormOrder.types'
import uniqueId from 'lodash/uniqueId'
import OrderSkuLine from '../OrderSkuLine'
import { useQuery } from '@tanstack/react-query'
import { queryFetch } from '@/utils/queryFetch'
import { ClientDetails } from '@/types/client'
import { ProductDetails } from '@/types/products'
import { numberToBRLString } from '@/utils/currency'

export function FormOrder() {
  const { control, register, handleSubmit, getValues } = useForm<OrderData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'products' })

  const { data: dataClient } = useQuery({
    queryKey: ['client/list'],
    queryFn: queryFetch<ClientDetails[]>,
    refetchOnWindowFocus: false,
  })

  const { data: dataProduct } = useQuery({
    queryKey: ['product/list'],
    queryFn: queryFetch<ProductDetails[]>,
    refetchOnWindowFocus: false,
  })

  const listClients = dataClient?.map((c) => ({ value: c.id, label: `${c.name} - ${c.street}, ${c.number}` }))

  const listProduct = dataProduct?.map((p) => ({ value: p.id, label: p.name, price: numberToBRLString(p.price) }))

  console.log({ listClients, listProduct })

  function onSubmit(data: OrderData) {
    console.log(data)
  }

  function addProducts() {
    append({ productId: 0, quantity: 0 })
  }

  function removeProduct(index: number) {
    return () => {
      remove(index)
    }
  }

  return (
    <Wrapper>
      <Title>Cadastrar pedido</Title>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <div className='w-1/4'>
            <Controller
              control={control}
              name='clientId'
              render={({ field: { onChange, value } }) => (
                <Select label='Selecione um cliente' items={listClients || []} value={value} onChange={onChange} />
              )}
            />
          </div>

          <div className='w-1/4'>
            <Input label='Observação sobre o pedido' {...register('observation')} />
          </div>
        </div>

        <div className='h-[1px] w-full bg-gray-200'></div>

        {fields &&
          fields.map(({ id }, index) => (
            <OrderSkuLine
              key={uniqueId('order-sku-line' + id)}
              index={index}
              control={control}
              removeProduct={removeProduct}
              products={listProduct || []}
              getValues={getValues}
            />
          ))}

        <div className='flex gap-2'>
          <button className='w-1/2 bg-primary py-2 rounded-lg text-white' type='button' onClick={addProducts}>
            Adicionar mais produtos
          </button>

          <button className='w-1/2 border border-primary border-solid py-2 rounded-lg text-primary'>
            Cadastrar pedido
          </button>
        </div>
      </form>
    </Wrapper>
  )
}
