import { describe, expect, it } from 'vitest'
import { menu } from './menu'
import { getActiveMenuName, getMenuHref, isMenuLinkActive } from './menu.utils'

describe('main menu navigation', () => {
  it('exposes both report destinations', () => {
    const report = menu.find(({ name }) => name === 'Relatório')
    expect(report?.subMenu).toEqual([
      { name: 'Balanço por cliente', url: 'client-balance' },
      { name: 'Balanço mensal', url: 'monthly-balance' },
    ])
  })

  it('marks only the exact submenu destination as active', () => {
    const href = getMenuHref('report', 'client-balance')
    expect(isMenuLinkActive('/report/client-balance?clientId=7', href)).toBe(true)
    expect(isMenuLinkActive('/report/monthly-balance', href)).toBe(false)
  })

  it('opens the accordion that owns the active route', () => {
    expect(getActiveMenuName(menu, '/report/client-balance')).toBe('Relatório')
    expect(getActiveMenuName(menu, '/home')).toBeNull()
  })
})
