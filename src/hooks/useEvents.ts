/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { EventEmitter } from '../events'
import { EventMap } from '../events/events.types'

type EventCallback = (...args: any) => void
type EventsHooks = [EventMap, EventCallback]

export function useEvents(events: EventsHooks[]) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    events.forEach(([topic, cb]) => {
      EventEmitter.listen(topic, cb)
    })
    return () => {
      events.forEach(([topic, cb]) => {
        EventEmitter.removeListener(topic, cb)
      })
    }
  }, [events])
}
