import * as SelectComponent from '@radix-ui/react-select'
import { SelectProps } from './Select.types'
import { Content, Group, Item, Label, Portal, Root, Trigger, Viewport, Wrapper } from './Select.styles'
import { forwardRef } from 'react'

export function Select({ label, items, onChange, value }: SelectProps) {
  function handleOnChange(value: string | number) {
    onChange(value)
  }

  return (
    <Wrapper>
      <Label>{label}</Label>
      <Root onValueChange={(value) => handleOnChange(value)} value={value as string}>
        <Trigger>
          <SelectComponent.Value />
        </Trigger>
        <Portal>
          <Content>
            <Viewport>
              <Group>
                {items.map((item) => (
                  <SelectComponentItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectComponentItem>
                ))}
              </Group>
            </Viewport>
          </Content>
        </Portal>
      </Root>
    </Wrapper>
  )
}

interface SelectComponentItemProps extends React.ComponentPropsWithoutRef<typeof SelectComponent.Item> {
  children?: React.ReactNode
  className?: string
}

const SelectComponentItem = forwardRef<HTMLDivElement, SelectComponentItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Item {...props} ref={forwardedRef}>
        <SelectComponent.ItemText>{children}</SelectComponent.ItemText>
        <SelectComponent.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
          <CheckIcon />
        </SelectComponent.ItemIndicator>
      </Item>
    )
  }
)

SelectComponentItem.displayName = 'SelectComponentItem'

const CheckIcon: React.FC = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

export default Select
