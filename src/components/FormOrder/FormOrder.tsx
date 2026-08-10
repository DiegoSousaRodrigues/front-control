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
import { FormOrderProps, OrderData } from './FormOrder.types'
import OrderSkuLine from '../OrderSkuLine'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryFetch } from '@/utils/queryFetch'
import { ClientDetails } from '@/types/client'
import { ProductDetails } from '@/types/products'
import Message from '../lib/Message'
import { add } from '@/api-client/order'
import { showToastEvent } from '@/events/events'
import { useEffect, useState } from 'react'

export function FormOrder({ isSequence = false }: FormOrderProps) {
  const { control, register, handleSubmit, getValues, formState, setError, reset, setValue } = useForm<OrderData>()
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'products' })
  const [buttonText, setButtonText] = useState(isSequence ? 'Passar para o proximo cliente' : 'Cadastrar pedido')
  const [clientIndex, setClientIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const { data: dataClient, isLoading } = useQuery({
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

  const listProduct = dataProduct?.map((p) => ({ value: p.id, label: p.name, salePrice: p.salePrice }))

  useEffect(() => {
    if (!listClients?.length) {
      setValue('clientId', '')
      return
    }

    const boundedIndex = Math.min(clientIndex, listClients.length - 1)
    setValue('clientId', listClients[boundedIndex].value.toString())
  }, [clientIndex, listClients?.length, setValue])

  function advanceSequenceClient() {
    if (!isSequence || !listClients?.length) return

    const nextIndex = clientIndex + 1
    if (nextIndex >= listClients.length) {
      showToastEvent({ status: 'success', description: 'Fila de clientes concluida' })
      reset({ clientId: listClients[0].value.toString(), observation: '', products: [] })
      replace([])
      setClientIndex(0)
      setButtonText('Passar para o proximo cliente')
      return
    }

    setClientIndex(nextIndex)
    reset({ clientId: listClients[nextIndex].value.toString(), observation: '', products: [] })
    replace([])
    setButtonText('Passar para o proximo cliente')
  }

  async function onSubmit(data: OrderData) {
    if (!data.products.length) {
      if (isSequence) {
        advanceSequenceClient()
        return
      }

      setError('products', { type: 'required', message: 'Adicione ao menos um produto' })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await add(data)
      if (response.status == 200 || response.status == 201) {
        showToastEvent({ status: 'success', description: 'Pedido cadastrado com sucesso' })
        await queryClient.invalidateQueries({ queryKey: ['order/list'] })

        if (isSequence) {
          advanceSequenceClient()
        } else {
          reset({ clientId: listClients?.[0]?.value?.toString() || '', observation: '', products: [] })
          replace([])
          setButtonText('Cadastrar pedido')
        }
      }
    } catch {
      showToastEvent({ status: 'error', description: 'Erro ao salvar pedido. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function addProducts() {
    append({ productId: 0, quantity: 1 })
    setButtonText('Cadastrar pedido')
  }

  function removeProduct(index: number) {
    return () => {
      remove(index)
      if (fields.length === 1) {
        setButtonText('Passar para o proximo cliente')
      }
    }
  }

  if (isLoading) {
    return <>Carregando...</>
  }

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
                key={id}
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

          <SubmitButton disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : buttonText}</SubmitButton>
        </ButtonsRow>
      </Form>
    </Wrapper>
  )
}
