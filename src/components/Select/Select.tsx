import * as React from 'react'
import * as SelectComponent from '@radix-ui/react-select'
import { SelectProps } from './Select.types'
import { Content, Group, Label, Portal, Root, Trigger, Viewport, Wrapper } from './Select.styles'

export function Select({ label, items }: SelectProps) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Root>
        <Trigger>
          <SelectComponent.Value />
        </Trigger>
        <Portal>
          <Content className='overflow-hidden rounded-md bg-white border border-gray-200'>
            <Viewport className='p-[5px]'>
              <Group>
                {items.map((item) => (
                  <SelectComponentItem key={item.value} value={item.value}>
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

const SelectComponentItem = React.forwardRef<HTMLDivElement, SelectComponentItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectComponent.Item
        className={
          'hover:bg-primary hover:text-white h-[40px] flex items-center select-none rounded-lg text-[14px] leading-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none'
        }
        {...props}
        ref={forwardedRef}
      >
        <SelectComponent.ItemText>{children}</SelectComponent.ItemText>
        <SelectComponent.ItemIndicator className='absolute left-0 inline-flex w-[25px] items-center justify-center'>
          <CheckIcon />
        </SelectComponent.ItemIndicator>
      </SelectComponent.Item>
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
