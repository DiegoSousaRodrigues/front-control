import { useForm } from 'react-hook-form'
import { Input } from '../Input/Input'
import Message from '../Message'
import { Button, Form, Title, Wrapper, WrapperInputs } from './FormProduct.styles'
import { ProductData } from './FormProduct.types'
import { required } from '@/utils/validate'
import axios from 'axios'
import { showToastEvent } from '@/events/events'
import { ProductDetails } from '@/types/products'
import { useState } from 'react'

export function FormProduct({ props, type }: { props?: ProductDetails; type: 'edit' | 'add' }) {
  const { formState, register, reset, handleSubmit } = useForm<ProductData>({ defaultValues: props })
  const [disabled, setDisabled] = useState<boolean>(false)

  async function onSubmit(params: ProductData) {
    setDisabled(true)
    let response
    let message

    if (type === 'add') {
      response = await axios.post('/api/product', params)
      message = 'adicionado'
    } else if (type === 'edit') {
      response = await axios.put('/api/product', params)
      message = 'atualizado'
    }

    if (response?.status === 200) {
      showToastEvent({ status: 'success', description: `Produto ${message} com sucesso` })

      if (type === 'add') {
        reset()
      }
    }
    setDisabled(false)
  }

  return (
    <Wrapper>
      <Title>Adicionar produto</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-4'>
          <WrapperInputs>
            <Input label='Nome:' mask='letter-only' {...register('name', required('Nome'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Preço:' mask='currency' {...register('price', required('Preço'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>
        </div>

        <Button disabled={disabled}>{type === 'add' ? 'Salvar' : 'Editar'} Produto</Button>
      </Form>
    </Wrapper>
  )
}
