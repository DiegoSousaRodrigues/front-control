import { describe, expect, it } from 'vitest'
import { resolveSelectValue } from './Select.utils'

describe('controlled Select value', () => {
  it('does not fake a selection when there is exactly one option', () => {
    const items = [{ label: 'Batata', value: '7' }]
    expect(resolveSelectValue(items, '')).toBe('')
  })

  it('shows the value controlled by the form', () => {
    const items = [{ label: 'Batata', value: '7' }]
    expect(resolveSelectValue(items, '7')).toBe('7')
  })
})
