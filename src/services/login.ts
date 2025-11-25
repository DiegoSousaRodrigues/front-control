import { LoginForm } from '@/components/LoginScreen/LoginScreen.types'
import { apiControl } from '@/utils/api'

export async function login(body: LoginForm) {
  return await apiControl.post('/auth/login', body)
}
