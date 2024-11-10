import { useForm } from 'react-hook-form'
import { Input } from '../Input/Input'
import { Form, Title, Wrapper, WrapperInputs, FlexInputs } from './FormClient.styles'
import { ClientData } from './FormClient.types'
import { Required } from '@/utils/validate'

export function AddClient() {
  const { register, handleSubmit, formState } = useForm<ClientData>()

  function onSubmit(params: ClientData) {
    console.log(params)
  }

  return (
    <Wrapper>
      <Title>Adicionar cliente</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FlexInputs>
          <WrapperInputs>
            <Input label='Nome:' {...register('name', Required('Nome'))} />
            <span>{formState.errors.name && formState.errors.name.message}</span>
          </WrapperInputs>
          <WrapperInputs>
            <Input label='Documento:' {...register('document')} />
          </WrapperInputs>
          <WrapperInputs>
            <Input label='Celular:' {...register('phone')} />
          </WrapperInputs>
          <WrapperInputs>
            <Input label='Telefone:' {...register('telephone')} />
          </WrapperInputs>
          <WrapperInputs>
            <Input label='Data de nascimento:' {...register('birthdate')} />
          </WrapperInputs>
        </FlexInputs>
        <Input label='Rua:' {...register('street')} />
        <Input label='Bairro:' {...register('quarter')} />
        <Input label='Numero:' {...register('number')} />
        <Input label='Complemento:' {...register('complement')} />
        <Input label='CEP:' {...register('zipcode')} />
        <Input label='Tipo de endereço:' {...register('addressType')} /> {/* Transformar em Select */}
        <Input label='Referencia:' {...register('addressReference')} />
        <Input label='Posição:' {...register('position')} />
        <button>Enviar</button>
      </Form>
    </Wrapper>
  )
}
