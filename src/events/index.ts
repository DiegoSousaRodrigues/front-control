/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventMap } from './events.types'

export const EventEmitter = {
  events: new Map<EventMap, ((data: any) => void)[]>(),
  removeListener: (topic: EventMap, fn: any) => {
    const listeners = EventEmitter.events.get(topic)
    if (listeners) {
      EventEmitter.events.set(topic, listeners?.filter((listener) => listener !== fn) || [])
    }
  },
  listen: (topic: EventMap, cb: (...args: any) => void) => {
    const oldEvents = EventEmitter.events.get(topic) || []
    if (EventEmitter.events.has(topic)) {
      return EventEmitter.events.set(topic, [...oldEvents, cb])
    }
    return EventEmitter.events.set(topic, [cb])
  },
  emit: (topic: EventMap, data?: any) => {
    const myListeners = EventEmitter.events.get(topic)
    if (Array.isArray(myListeners) && myListeners.length) {
      myListeners.forEach((event) => event(data))
    }
  },
}
