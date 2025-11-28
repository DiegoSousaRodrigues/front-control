import { PropsWithChildren } from 'react'
import EventsProvider from './EventsContext'
import { AuthProvider } from './AuthContext'

export const MainProvider = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <EventsProvider />
      {children}
    </AuthProvider>
  )
}

