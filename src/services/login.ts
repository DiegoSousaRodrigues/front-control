import { LoginForm } from '@/components/LoginScreen/LoginScreen.types'
import { UserProps } from '@/types/login'
import axios from 'axios'

export async function login(body: LoginForm) {
  return await axios.post<{ user: UserProps }>('/api/auth/login', body)
}

export async function logout() {
  return await axios.post('/api/auth/logout')
}
