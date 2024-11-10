import { Content, Wrapper } from './Container.styles'

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <Content>{children}</Content>
    </Wrapper>
  )
}
