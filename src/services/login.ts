import { LoginForm } from '@/components/LoginScreen/LoginScreen.types'
import { User } from '@/types/login'
import { apiControl } from '@/utils/api'

export async function login(body: LoginForm) {
  return await apiControl.post<User>('/auth/login', body)
}
