import { useAuth } from '@/contexts/AuthContext'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function WithLogin(cb: any) {
  const auth = useAuth()
  if (auth.isAuthenticated) {
    cb()
  } else {
    //TODO redirect to loginScreen
  }
}
