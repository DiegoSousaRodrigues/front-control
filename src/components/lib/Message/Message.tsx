import React from 'react'
import { Wrapper } from './Message.styles'

export function Message({ children }: { children: React.ReactNode }) {
  return <Wrapper>{children}</Wrapper>
}
