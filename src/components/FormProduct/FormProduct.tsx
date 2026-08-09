/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '../lib/Input/Input'
import Message from '../lib/Message'
import { Button, Form, Title, Wrapper, WrapperInputs } from './FormProduct.styles'
import { ProductData } from './FormProduct.types'
import { required } from '@/utils/validate'
import { showToastEvent } from '@/events/events'
import { ProductDetails } from '@/types/products'
import { add, update } from '@/api-client/product'
import UploadFile from '../lib/UploadFile'

export function FormProduct({ props, type }: { props?: ProductDetails; type: 'edit' | 'add' }) {
  const { formState, register, reset, handleSubmit, control } = useForm<ProductData>({
    defaultValues: props,
  })
  const [disabled, setDisabled] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const isEdit = type === 'edit'

  async function onSubmit(params: ProductData) {
    try {
      setDisabled(true)

      const formData = new FormData()
      formData.append('name', params.name)
      formData.append('price', String(params.price))
      formData.append('showOnWebsite', String(Boolean(params.showOnWebsite)))

      if (params.file instanceof File) {
        formData.append('file', params.file)
      }

      let response
      let text

      if (type === 'add') {
        response = await add(formData)
        text = 'adicionado'
      } else {
        if (!props?.id) {
          showToastEvent({ status: 'error', description: 'Não foi possível identificar o produto' })
          return
        }

        response = await update(props.id, formData)
        text = 'atualizado'
      }

      if (response?.status === 200) {
        showToastEvent({
          status: 'success',
          description: `Produto ${text} com sucesso`,
        })
        await queryClient.invalidateQueries({ queryKey: ['product/list'] })

        if (type === 'add') {
          reset()
        }
      }
    } catch {
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
      onChange(file)
    }
  }

  return (
    <Wrapper>
      <Title>{isEdit ? 'Editar produto' : 'Adicionar produto'}</Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-4'>
          <WrapperInputs>
            <Input label='Nome:' mask='letter-only' {...register('name', required('Nome'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Preço:' mask='currency' {...register('price', required('Preço'))} />
            {formState.errors.price && <Message>{formState.errors.price.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <label className='flex items-center gap-2 text-xs text-primary px-2'>
              <input type='checkbox' {...register('showOnWebsite')} />
              Exibir no site
            </label>
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

        <Button disabled={disabled}>{disabled ? 'Salvando...' : `${isEdit ? 'Editar' : 'Salvar'} Produto`}</Button>
      </Form>
    </Wrapper>
  )
}
