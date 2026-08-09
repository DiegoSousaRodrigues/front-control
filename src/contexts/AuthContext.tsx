import { createContext, ReactNode, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { login as loginRequest, logout as logoutRequest } from '@/services/login'
import { LoginForm } from '@/components/LoginScreen/LoginScreen.types'
import { UserProps } from '@/types/login'

type AuthContextType = {
  isAuthenticated: boolean
  user: UserProps | null
  signIn: (data: LoginForm) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProps | null>(null)
  const isAuthenticated = !!user
  const router = useRouter()

  useEffect(() => {
    setUser(null)
  }, [])

  async function signIn({ login, password }: LoginForm) {
    const response = await loginRequest({ login, password })
    const { user } = response.data

    setUser(user)

    router.push('/home')
  }

  function signOut() {
    void logoutRequest()
    setUser(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
