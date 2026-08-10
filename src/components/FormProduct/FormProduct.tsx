/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '../lib/Input/Input'
import Message from '../lib/Message'
import { Button, FlexInputs, Form, Title, Wrapper, WrapperInputs } from './FormProduct.styles'
import { ProductFormData } from './FormProduct.types'
import { required } from '@/utils/validate'
import { showToastEvent } from '@/events/events'
import { ProductDetails, ProductRequest } from '@/types/products'
import { add, update } from '@/api-client/product'
import UploadFile from '../lib/UploadFile'
import { BRLStringToNumber } from '@/utils/currency'
import { createProductFormData, productDetailsToFormData } from '@/utils/productFormData'

function requiredCurrency(label: string, minimum: number) {
  return {
    required: `${label} é obrigatório`,
    validate: (value: string) => {
      const parsedValue = BRLStringToNumber(value)
      return (
        (Number.isFinite(parsedValue) && parsedValue >= minimum) ||
        `${label} deve ser ${minimum === 0 ? 'zero ou maior' : 'maior que zero'}`
      )
    },
  }
}

export function FormProduct({ props, type }: { props?: ProductDetails; type: 'edit' | 'add' }) {
  const { formState, register, reset, handleSubmit, control } = useForm<ProductFormData>({
    defaultValues: props
      ? productDetailsToFormData(props)
      : { name: '', purchasePrice: '', salePrice: '' },
  })
  const [disabled, setDisabled] = useState(false)
  const queryClient = useQueryClient()
  const isEdit = type === 'edit'

  async function onSubmit(params: ProductFormData) {
    try {
      setDisabled(true)

      const product: ProductRequest = {
        name: params.name,
        purchasePrice: BRLStringToNumber(params.purchasePrice),
        salePrice: BRLStringToNumber(params.salePrice),
      }
      const formData = createProductFormData(product, params.file)

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
        showToastEvent({ status: 'success', description: `Produto ${text} com sucesso` })
        await queryClient.invalidateQueries({ queryKey: ['product/list'] })

        if (type === 'add') {
          reset({ name: '', purchasePrice: '', salePrice: '' })
        }
      }
    } catch {
      showToastEvent({ status: 'error', description: 'Erro ao salvar produto. Tente novamente.' })
    } finally {
      setDisabled(false)
    }
  }

  function handleOnChangeFile(onChange: (...event: any[]) => void) {
    return (file?: File) => onChange(file)
  }

  return (
    <Wrapper>
      <Title>{isEdit ? 'Editar produto' : 'Adicionar produto'}</Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FlexInputs>
          <WrapperInputs>
            <Input label='Nome:' mask='letter-only' {...register('name', required('Nome'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input
              label='Valor de compra:'
              mask='currency'
              inputMode='decimal'
              {...register('purchasePrice', requiredCurrency('Valor de compra', 0))}
            />
            {formState.errors.purchasePrice && <Message>{formState.errors.purchasePrice.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input
              label='Valor de venda:'
              mask='currency'
              inputMode='decimal'
              {...register('salePrice', requiredCurrency('Valor de venda', 0.01))}
            />
            {formState.errors.salePrice && <Message>{formState.errors.salePrice.message}</Message>}
          </WrapperInputs>
        </FlexInputs>

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
