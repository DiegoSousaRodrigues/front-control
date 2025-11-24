import { ChangeEvent, forwardRef, Ref, useEffect, useImperativeHandle, useRef } from 'react'
import { InputElement, Label, Wrapper } from './Input.styles'
import { InputProps } from './Input.types'
import { inputMask } from './mask'

function InputComponent({ label, mask, value, ...props }: InputProps, ref: Ref<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const _event = { ...e }
    let v = _event.target.value
    if (mask) {
      v = getValueWithMask(e.target.value)
      if (inputRef.current) {
        inputRef.current.value = v
      }
    }

    _event.target.value = v
    if (props.onChange) {
      props.onChange(_event)
    }
  }

  useEffect(() => {
    if (mask && inputRef.current) {
      inputRef.current.value = getValueWithMask(inputRef.current.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const _value = value ? getValueWithMask(value.toString() as string) : value

  function getValueWithMask(value: string) {
    if (mask && value) {
      if (typeof mask === 'string') {
        return inputMask(value, mask)
      } else {
        return mask(value)
      }
    }
    return value
  }

  return (
    <Wrapper disabled={props.disabled}>
      {label && <Label>{label}</Label>}
      <InputElement {...props} onChange={handleChange} value={_value} ref={inputRef} />
    </Wrapper>
  )
}

export const Input = forwardRef(InputComponent)
