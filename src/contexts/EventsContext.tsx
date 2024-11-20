import { Toast } from '@/components/Toast/Toast'
import { ToastEventProps } from '@/components/Toast/Toast.types'
import { EventMap } from '@/events/events.types'
import { useEvents } from '@/hooks/useEvents'
import { useState } from 'react'
import uniqueId from 'lodash/uniqueId'

export default function EventsProvider() {
  const [toasts, setToasts] = useState<(ToastEventProps & { id: string })[]>([])

  const handleShowToast = (_props: ToastEventProps) => {
    const toast = {
      ..._props,
      id: uniqueId(),
    }
    setToasts((t) => [...t, toast])
  }

  const handleToastOpenChange = (id: string) => (value: boolean) => {
    if (!value) {
      setToasts((ts) => ts.filter((t) => t.id != id))
    }
  }

  useEvents([[EventMap.SHOW_TOAST, handleShowToast]])

  return (
    <>
      <Toast.Provider>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onOpenChange={handleToastOpenChange(t.id)} />
        ))}
      </Toast.Provider>
    </>
  )
}
