import Container from '@/components/Container'
import {
  AccordionContent,
  AccordionHeader,
  AccordionHeaderContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  ArrowAccess,
  Content,
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
      <Content>
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
      </Content>
      <Container>{children}</Container>
    </Wrapper>
  )
}
