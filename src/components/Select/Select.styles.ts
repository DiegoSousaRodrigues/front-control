import styled, { w } from 'windstitch'
import * as Select from '@radix-ui/react-select'

export const Wrapper = w.div('flex flex-col')

export const Label = w.label('text-xs text-primary px-2')

export const Root = styled(Select.Root, {})

export const Trigger = styled(Select.Trigger, {
  className:
    'w-full h-[38px] rounded-lg border border-solid px-4 text-start border-gray-200 hover:border-primary focus:border focus:border-primary overflow-hidden',
})

export const Portal = styled(Select.Portal, {})

export const Content = styled(Select.Content, {
  className: 'overflow-hidden rounded-md bg-white border border-gray-200',
})

export const Viewport = styled(Select.Viewport, {})

export const Group = styled(Select.Group, {})

export const Item = styled(Select.Item, {
  className:
    'px-4 hover:bg-primary hover:text-white h-[40px] flex items-center select-none rounded-lg text-[14px] leading-none border-none',
})
