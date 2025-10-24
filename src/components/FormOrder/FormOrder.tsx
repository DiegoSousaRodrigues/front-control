import { Input } from '../Input/Input'
import Select from '../Select'
import { Title, Wrapper } from './FormOrder.styles'

export const mockClients = [
  { value: '1', label: 'Ana Souza' },
  { value: '2', label: 'Bruno Almeida' },
  { value: '3', label: 'Carla Ferreira' },
  { value: '4', label: 'Diego Lima' },
  { value: '5', label: 'Eduarda Santos' },
  { value: '6', label: 'Felipe Oliveira' },
  { value: '7', label: 'Gabriela Costa' },
  { value: '8', label: 'Henrique Ribeiro' },
  { value: '9', label: 'Isabela Martins' },
  { value: '10', label: 'João Carvalho' },
]

export function FormOrder() {
  return (
    <Wrapper>
      <Title>Cadastrar pedido</Title>
      <form className='flex flex-col gap-4'>
        <Select label='Selecione um cliente' items={mockClients} />

        <div className='flex gap-2 items-center'>
          <label>
            Produto
            <select>
              <option>Batata</option>
              <option>Cenoura</option>
            </select>
          </label>
          <Input label='Quantidade' mask='number-only' maxLength={4} />
        </div>
        <button>Adicionar mais produtos</button>
      </form>
    </Wrapper>
  )
}
