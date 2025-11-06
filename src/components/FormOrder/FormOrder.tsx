/* eslint-disable react-hooks/exhaustive-deps */
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Input } from '../lib/Input/Input'
import Select from '../lib/Select'
import {
  Title,
  Wrapper,
  Form,
  FieldsRow,
  ClientField,
  ClientSelectContainer,
  ObservationField,
  Separator,
  ButtonsRow,
  AddButton,
  SubmitButton,
  FlexCol,
} from './FormOrder.styles'
import { OrderData } from './FormOrder.types'
import uniqueId from 'lodash/uniqueId'
import OrderSkuLine from '../OrderSkuLine'
import { useQuery } from '@tanstack/react-query'
import { queryFetch } from '@/utils/queryFetch'
import { ClientDetails } from '@/types/client'
import { ProductDetails } from '@/types/products'
import Message from '../lib/Message'
import { add } from '@/api-client/order'
import { showToastEvent } from '@/events/events'

export function FormOrder() {
  const { control, register, handleSubmit, getValues, formState, setError, reset, setValue } = useForm<OrderData>()
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

  async function onSubmit(data: OrderData) {
    if (!data.products.length) {
      setError('products', { type: 'required', message: 'Adicione ao menos um produto' })
      return
    }

    const response = await add(data)
    if (response.status == 200) {
      showToastEvent({ status: 'success', description: 'Produto adicionado com sucesso' })
      reset()
      setValue('clientId', 0)

      fields.forEach((_, index) => remove(index))
    }
  }

  function addProducts() {
    append({ productId: 0, quantity: 0 })
  }

  function removeProduct(index: number) {
    return () => {
      remove(index)
    }
  }

  const listClients = dataClient?.map((c) => ({ value: c.id, label: `${c.name} - ${c.street}, ${c.number}` }))

  const listProduct = dataProduct?.map((p) => ({ value: p.id, label: p.name, price: p.price }))

  return (
    <Wrapper>
      <Title>Cadastrar pedido</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FieldsRow>
          <ClientField>
            <ClientSelectContainer>
              <Controller
                control={control}
                name='clientId'
                rules={{ required: 'Campo obrigatorio' }}
                render={({ field: { onChange, value } }) => (
                  <Select label='Selecione um cliente' items={listClients || []} value={value} onChange={onChange} />
                )}
              />
            </ClientSelectContainer>
            {formState.errors.clientId && <Message>{formState.errors.clientId.message}</Message>}
          </ClientField>

          <ObservationField>
            <Input label='Observação sobre o pedido' {...register('observation')} />
          </ObservationField>
        </FieldsRow>

        <Separator />

        <FlexCol>
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

          {formState.errors.products && <Message>{formState.errors.products.message}</Message>}
        </FlexCol>

        <ButtonsRow>
          <AddButton type='button' onClick={addProducts}>
            Adicionar mais produtos
          </AddButton>

          <SubmitButton>Cadastrar pedido</SubmitButton>
        </ButtonsRow>
      </Form>
    </Wrapper>
  )
}
