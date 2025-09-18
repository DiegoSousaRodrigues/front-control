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
  WrapperImage,
} from './MainLayout.styles'
import { SubMenu } from './MainLayout.types'
import { icons, menu } from './menu'
import Image from 'next/image'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Content>
        <WrapperImage>
          <Empty>
            <Image alt='Logo' src='/images/logo.png' width={100} height={100} />
          </Empty>
        </WrapperImage>
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
