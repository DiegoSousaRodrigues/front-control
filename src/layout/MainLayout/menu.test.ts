import { describe, expect, it } from 'vitest'
import { getMainMenu, menu } from './menu'
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
    expect(getActiveMenuName(getMainMenu(true), '/invoice/[id]')).toBe('Faturas')
  })

  it('keeps legacy navigation by default and exposes billing only at cutover', () => {
    expect(getMainMenu(false).some(({ name }) => name === 'Pedidos')).toBe(true)
    const billing = getMainMenu(true)
    expect(billing.find(({ name }) => name === 'Faturas')?.subMenu).toEqual([
      { name: 'Emitir', url: 'add' },
      { name: 'Listar', url: 'list' },
      { name: 'Sequência', url: 'queue' },
    ])
    expect(billing.find(({ name }) => name === 'Pagamentos')?.subMenu).toHaveLength(2)
  })
})
