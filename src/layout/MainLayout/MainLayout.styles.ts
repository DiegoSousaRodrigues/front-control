import NextLink from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import styled, { w } from 'windstitch'

export const Wrapper = w.div('flex bg-gray-100 h-full')

export const Content = w.div('w-1/5 px-4 py-2 bg-white')

export const WrapperImage = w.div('w-full flex gap-4 justify-center')

export const AccordionRoot = styled(Accordion.Root, {
  className: 'flex flex-col gap-4 px-2 py-2',
})

export const AccordionItem = styled(Accordion.Item, {
  className: 'rounded-md ',
})

export const AccordionTrigger = styled(Accordion.Trigger, {
  className:
    'group w-full py-4 px-4 hover:bg-gray-100 rounded-md data-[state=open]:bg-gray-100 data-[state=open]:text-primary',
})

export const AccordionHeader = styled(Accordion.Header, {
  className: 'w-full flex justify-between items-center',
})

export const AccordionHeaderContent = w.div('flex gap-4 items-center')

export const Empty = w.div('')

export const Title = w.span('font-bold text-sm')

export const MainArrow = styled(MdOutlineKeyboardArrowDown, {
  className:
    'group-data-[state=open]:rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
})

export const ArrowAccess = styled(MdOutlineKeyboardArrowRight, {})

export const AccordionContent = styled(Accordion.Content, {
  className: 'w-full overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
})

export const LinkStyled = styled(NextLink, {
  className: 'flex px-4 py-2 w-full jus justify-between items-center rounded-md hover:bg-gray-100',
})
