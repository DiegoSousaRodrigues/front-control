import { useForm } from 'react-hook-form'
import { Input } from '../Input/Input'
import { Form, Title, Wrapper, WrapperInputs, FlexInputs, Button } from './FormClient.styles'
import { ClientData } from './FormClient.types'
import { Required } from '@/utils/validate'
import Message from '../Message'
import axios from 'axios'

export function AddClient() {
  const { register, handleSubmit, formState } = useForm<ClientData>()

  function onSubmit(params: ClientData) {
    axios.post('/api/client', params)
    console.log(params)
  }

  return (
    <Wrapper>
      <Title>Adicionar cliente</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FlexInputs>
          <WrapperInputs>
            <Input label='Nome:' {...register('name', Required('Nome'))} />
            {formState.errors.name && <Message>{formState.errors.name.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Documento:' {...register('document', Required('Documento'))} />
            {formState.errors.document && <Message>{formState.errors.document.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Celular:' {...register('phone', Required('Celular'))} />
            {formState.errors.phone && <Message>{formState.errors.phone.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Telefone:' {...register('telephone', Required('Telefone'))} />
            {formState.errors.telephone && <Message>{formState.errors.telephone.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Data de nascimento:' {...register('birthdate', Required('Data de nascimento'))} />
            {formState.errors.birthdate && <Message>{formState.errors.birthdate.message}</Message>}
          </WrapperInputs>
        </FlexInputs>

        <FlexInputs>
          <WrapperInputs>
            <Input label='CEP:' {...register('zipcode', Required('CEP'))} />
            {formState.errors.zipcode && <Message>{formState.errors.zipcode.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Rua:' {...register('street', Required('Rua'))} />
            {formState.errors.street && <Message>{formState.errors.street.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Numero:' {...register('number', Required('Numero'))} />
            {formState.errors.number && <Message>{formState.errors.number.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Bairro:' {...register('quarter', Required('Bairro'))} />
            {formState.errors.quarter && <Message>{formState.errors.quarter.message}</Message>}
          </WrapperInputs>

          <WrapperInputs>
            <Input label='Complemento:' {...register('complement', Required('Complemento'))} />
            {formState.errors.complement && <Message>{formState.errors.complement.message}</Message>}
          </WrapperInputs>
        </FlexInputs>
        <FlexInputs>
          <WrapperInputs quantity={3}>
            <Input label='Tipo de endereço:' {...register('addressType', Required('Tipo de endereço'))} />
            {/* Transformar em Select */}
            {formState.errors.addressType && <Message>{formState.errors.addressType.message}</Message>}
          </WrapperInputs>

          <WrapperInputs quantity={3}>
            <Input label='Referencia:' {...register('addressReference', Required('Referencia'))} />
            {formState.errors.addressReference && <Message>{formState.errors.addressReference.message}</Message>}
          </WrapperInputs>

          <WrapperInputs quantity={3}>
            <Input label='Posição:' {...register('position', Required('Posição'))} />
            {formState.errors.position && <Message>{formState.errors.position.message}</Message>}
          </WrapperInputs>
        </FlexInputs>

        <Button>Salvar Cliente</Button>
      </Form>
    </Wrapper>
  )
}
