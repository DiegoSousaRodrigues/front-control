import {
  AccordionContent,
  AccordionHeader,
  AccordionHeaderContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  ArrowAccess,
  Component,
  Empty,
  LinkStyled,
  MainArrow,
  Title,
  Wrapper,
} from './MainLayout.styles'
import { SubMenu } from './MainLayout.types'
import { icons, menu } from './menu'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <div className='w-1/5 px-4 py-2 bg-white'>
        <div className='w-full flex gap-4 items-center'>
          <Empty>Icone</Empty>
          <span className='text-2xl'>Dist. MS</span>
        </div>
        <AccordionRoot type='multiple'>
          {menu.map(({ name, icon, subMenu, defaultLink }) => {
            const Icon = icons.get(icon)
            return (
              <AccordionItem value={name} key={name + icon}>
                <AccordionTrigger>
                  <AccordionHeader>
                    <AccordionHeaderContent>
                      <Empty>{Icon && <Icon size={20} />}</Empty>
                      <Title>{name}</Title>
                    </AccordionHeaderContent>
                    <MainArrow />
                  </AccordionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  {subMenu?.map(({ name, url }: SubMenu) => (
                    <LinkStyled href={`/${defaultLink}/${url}`} key={name + url}>
                      <span>{name}</span>
                      <ArrowAccess />
                    </LinkStyled>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </AccordionRoot>
      </div>
      <Component>{children}</Component>
    </Wrapper>
  )
}
