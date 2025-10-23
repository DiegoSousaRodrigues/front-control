import { Input } from '../Input/Input'
import { Root, Title, Wrapper } from './FormOrder.styles'

export function FormOrder() {
  return (
    <Wrapper>
      <Title>Cadastrar pedido</Title>
      <form className='flex flex-col gap-4'>
        <Root></Root>

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
