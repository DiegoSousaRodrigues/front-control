import { ToastEventProps } from '@/components/Toast/Toast.types'
import { EventEmitter } from '.'
import { EventMap } from './events.types'

export function showToastEvent(data: ToastEventProps) {
  EventEmitter.emit(EventMap.SHOW_TOAST, data)
}
