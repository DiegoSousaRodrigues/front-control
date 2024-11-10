import { Ref } from 'react'
import { InputComponent, Label, Wrapper } from './Input.styles'
import { InputProps } from './Input.types'

export function Input({ label, ...props }: InputProps) {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <InputComponent {...props} />
    </Wrapper>
  )
}
