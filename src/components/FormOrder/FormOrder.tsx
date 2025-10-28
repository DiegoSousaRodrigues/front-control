import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '../Input/Input'
import Select from '../Select'
import { Title, Wrapper } from './FormOrder.styles'
import { OrderData } from './FormOrder.types'
import uniqueId from 'lodash/uniqueId'
import OrderSkuLine from '../OrderSkuLine'

const mockClients = [
  { value: 1, label: 'Ana Souza' },
  { value: 2, label: 'Bruno Almeida' },
  { value: 3, label: 'Carla Ferreira' },
  { value: 4, label: 'Diego Lima' },
  { value: 5, label: 'Eduarda Santos' },
  { value: 6, label: 'Felipe Oliveira' },
  { value: 7, label: 'Gabriela Costa' },
  { value: 8, label: 'Henrique Ribeiro' },
  { value: 9, label: 'Isabela Martins' },
  { value: 10, label: 'João Carvalho' },
]

const mockProducts = [
  {
    value: 1,
    label: 'Batata',
    price: 'R$ 150,00',
  },
  {
    value: 2,
    label: 'Cenoura',
    price: 'R$ 250,00',
  },
]

export function FormOrder() {
  const { control, register, handleSubmit } = useForm<OrderData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'products' })

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
                <Select
                  label='Selecione um cliente'
                  items={mockClients}
                  value={value}
                  onChange={onChange}
                  addIndexZero
                />
              )}
            />
          </div>

          <div className='w-1/4'>
            <Input label='Observação sobre o pedido' {...register('observation')} />
          </div>
        </div>

        <div className='h-[1px] w-full bg-gray-200'></div>

        {fields &&
          fields.map(({ id, productId }, index) => (
            <OrderSkuLine
              key={uniqueId('order-sku-line' + id)}
              index={index}
              control={control}
              removeProduct={removeProduct}
              productId={productId}
              mockProducts={mockProducts}
            />
          ))}

        <button type='button' onClick={addProducts}>
          Adicionar mais produtos
        </button>
      </form>
    </Wrapper>
  )
}
