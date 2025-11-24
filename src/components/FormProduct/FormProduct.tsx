/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from 'react-hook-form'
import { Input } from '../lib/Input/Input'
import Message from '../lib/Message'
import { Button, Form, Title, Wrapper, WrapperInputs } from './FormProduct.styles'
import { ProductData } from './FormProduct.types'
import { required } from '@/utils/validate'
import { showToastEvent } from '@/events/events'
import { ProductDetails } from '@/types/products'
import { useState } from 'react'
import { add, update } from '@/api-client/product'
import UploadFile from '../lib/UploadFile'

export function FormProduct({ props, type }: { props?: ProductDetails; type: 'edit' | 'add' }) {
  const { formState, register, reset, handleSubmit, control } = useForm<ProductData>({
    defaultValues: props,
  })
  const [disabled, setDisabled] = useState<boolean>(false)

  async function onSubmit(params: ProductData) {
    try {
      setDisabled(true)

      const formData = new FormData()
      formData.append('name', params.name)
      formData.append('price', String(params.price))

      if (params.file) {
        formData.append('file', params.file)
      }

      const actionMap = {
        add: { fn: add, text: 'adicionado' },
        edit: { fn: update, text: 'atualizado' },
      }

      const { fn, text } = actionMap[type]

      const response = await fn(formData)

      if (response?.status === 200) {
        showToastEvent({
          status: 'success',
          description: `Produto ${text} com sucesso`,
        })

        if (type === 'add') {
          reset()
        }
      }
    } catch (error) {
      console.error(error)
      showToastEvent({
        status: 'error',
        description: 'Erro ao salvar produto. Tente novamente.',
      })
    } finally {
      setDisabled(false)
    }
  }

  function handleOnChangeFile(onChange: (...event: any[]) => void) {
    return (file?: File) => {
      console.log(file)

      onChange(file)
    }
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

        <WrapperInputs>
          <Controller
            name='file'
            control={control}
            render={({ field: { onChange, value } }) => (
              <UploadFile label='Incluir imagem:' onChange={handleOnChangeFile(onChange)} value={value} />
            )}
          />
        </WrapperInputs>

        <Button disabled={disabled}>{type === 'add' ? 'Salvar' : 'Editar'} Produto</Button>
      </Form>
    </Wrapper>
  )
}
