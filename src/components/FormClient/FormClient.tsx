import { useForm } from 'react-hook-form'
import { Form, Title, Wrapper, WrapperInputs, FlexInputs, Button } from './FormClient.styles'
import { ClientData } from './FormClient.types'
import { required } from '@/utils/validate'
import Message from '../lib/Message'
import { Input } from '../lib/Input/Input'
import { ClientDetails } from '@/types/client'
import { showToastEvent } from '@/events/events'
import { add, update } from '@/api-client/client'

export function FormClient({ props, type }: { props?: ClientDetails; type: 'edit' | 'add' }) {
  const { register, handleSubmit, formState, reset } = useForm<ClientData>({ defaultValues: props })

  async function onSubmit(params: ClientData) {
    let response
    let message

    if (type === 'add') {
      response = await add(params)
      message = 'adicionado'
    } else if (type === 'edit') {
      response = await update(params)
      message = 'atualizado'
    }

    if (response?.status === 200) {
      showToastEvent({ status: 'success', description: `Cliente ${message} com sucesso` })

      if (type === 'add') {
        reset()
      }
    }
  }

  return (
    <Wrapper>
      <Title>Adicionar cliente</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FlexInputs>
          <WrapperInputs>
            <Input label='Nome:' mask='letter-only' {...register('name', required('Nome'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Documento:' mask='cpf' {...register('document', required('Documento'))} />
            {formState.errors.document && <Message>{formState.errors.document.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Celular:' mask='cel' {...register('phone', required('Celular'))} />
            {formState.errors.phone && <Message>{formState.errors.phone.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Telefone:' mask='cel' {...register('telephone')} />
            {formState.errors.telephone && <Message>{formState.errors.telephone.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Data de nascimento:' mask='date' {...register('birthdate', required('Data de nascimento'))} />
            {formState.errors.birthdate && <Message>{formState.errors.birthdate.message}</Message>}
          </WrapperInputs>
        </FlexInputs>

        <FlexInputs>
          <WrapperInputs>
            <Input label='CEP:' mask='cep' {...register('zipcode', required('CEP'))} />
            {formState.errors.zipcode && <Message>{formState.errors.zipcode.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Rua:' mask='letter-only' {...register('street', required('Rua'))} />
            {formState.errors.street && <Message>{formState.errors.street.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Numero:' {...register('number', required('Numero'))} />
            {formState.errors.number && <Message>{formState.errors.number.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Bairro:' mask='letter-only' {...register('quarter', required('Bairro'))} />
            {formState.errors.quarter && <Message>{formState.errors.quarter.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Complemento:' {...register('complement')} />
            {formState.errors.complement && <Message>{formState.errors.complement.message}</Message>}
          </WrapperInputs>
        </FlexInputs>
        <FlexInputs>
          <WrapperInputs quantity={3}>
            <Input label='Tipo de endereço:' {...register('addressType', required('Tipo de endereço'))} />
            {/* Transformar em Select */}
            {formState.errors.addressType && <Message>{formState.errors.addressType.message}</Message>}
          </WrapperInputs>

          <WrapperInputs quantity={3}>
            <Input label='Referencia:' {...register('addressReference')} />
            {formState.errors.addressReference && <Message>{formState.errors.addressReference.message}</Message>}
          </WrapperInputs>

          <WrapperInputs quantity={3}>
            <Input label='Posição:' mask='number-only' {...register('position')} />
            {formState.errors.position && <Message>{formState.errors.position.message}</Message>}
          </WrapperInputs>
        </FlexInputs>

        <Button>{type === 'add' ? 'Salvar' : 'Editar'} Cliente</Button>
      </Form>
    </Wrapper>
  )
}
