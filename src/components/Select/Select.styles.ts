import styled, { w } from 'windstitch'
import * as Select from '@radix-ui/react-select'

export const Wrapper = w.div('flex flex-col')

export const Label = w.label('text-xs text-primary px-2')

export const Root = styled(Select.Root, {})

export const Trigger = styled(Select.Trigger, {
  className: 'w-full h-[35px] rounded border border-solid px-4 text-start border-gray-200 text-gray-400',
})

export const Portal = styled(Select.Portal, {})

export const Content = styled(Select.Content, {})

export const Viewport = styled(Select.Viewport, {})

export const Group = styled(Select.Group, {})

export const Item = styled(Select.Item, {})
