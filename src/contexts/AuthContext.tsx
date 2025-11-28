import { createContext, ReactNode, useContext, useState, useEffect } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/router'
import { login as loginRequest } from '@/services/login'
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
    const { 'control-user': userCookie } = parseCookies()

    if (userCookie) {
      setUser(JSON.parse(userCookie))
    }
  }, [])

  async function signIn({ login, password }: LoginForm) {
    try {
      const response = await loginRequest({ login, password })
      const { token, user } = response.data

      setCookie(undefined, 'control-token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      setCookie(undefined, 'control-user', JSON.stringify(user), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      setUser(user)

      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function signOut() {
    destroyCookie(undefined, 'control-token')
    destroyCookie(undefined, 'control-user')
    setUser(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
