import { apiControl } from '@/utils/api'

export async function FindAll() {
  return await apiControl.get('client/list')
}
