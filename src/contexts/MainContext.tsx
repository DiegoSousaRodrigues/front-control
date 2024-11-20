import { PropsWithChildren } from 'react'
import EventsProvider from './EventsContext'

export const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <EventsProvider />
      {children}
    </>
  )
}
