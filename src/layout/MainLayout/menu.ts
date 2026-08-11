import { IconType } from 'react-icons'
import { MdAssessment, MdListAlt, MdOutlinePersonOutline, MdOutlineShoppingCart, MdPayments } from 'react-icons/md'
import { MainLayoutMenu } from './MainLayout.types'
import { isBillingV2Enabled } from '@/utils/billingV2'

export const icons = new Map<string, IconType>([
  ['person', MdOutlinePersonOutline],
  ['order', MdListAlt],
  ['products', MdOutlineShoppingCart],
  ['report', MdAssessment],
  ['payment', MdPayments],
])

export function getMainMenu(billingV2Enabled = isBillingV2Enabled()): MainLayoutMenu[] {
  const billingMenus: MainLayoutMenu[] = billingV2Enabled
    ? [
        {
          icon: 'order',
          name: 'Faturas',
          defaultLink: 'invoice',
          subMenu: [
            { name: 'Emitir', url: 'add' },
            { name: 'Listar', url: 'list' },
            { name: 'Sequência', url: 'queue' },
          ],
        },
        {
          icon: 'payment',
          name: 'Pagamentos',
          defaultLink: 'payment',
          subMenu: [
            { name: 'Registrar', url: 'add' },
            { name: 'Listar', url: 'list' },
          ],
        },
      ]
    : [
        {
          icon: 'order',
          name: 'Pedidos',
          defaultLink: 'order',
          subMenu: [
            { name: 'Cadastrar', url: 'add' },
            { name: 'Listar', url: 'list' },
            { name: 'Sequencia', url: 'queue' },
          ],
        },
      ]

  return [
    {
      icon: 'person',
      name: 'Clientes',
      defaultLink: 'client',
      subMenu: [
        {
          name: 'Cadastrar',
          url: 'add',
        },
        {
          name: 'Listar',
          url: 'list',
        },
      ],
    },
    ...billingMenus,
    {
      icon: 'products',
      name: 'Produtos',
      defaultLink: 'product',
      subMenu: [
        {
          name: 'Cadastrar',
          url: 'add',
        },
        {
          name: 'Listar',
          url: 'list',
        },
      ],
    },
    {
      icon: 'report',
      name: 'Relatório',
      defaultLink: 'report',
      subMenu: [
        {
          name: 'Balanço por cliente',
          url: 'client-balance',
        },
        {
          name: 'Balanço mensal',
          url: 'monthly-balance',
        },
      ],
    },
  ]
}

export const menu = getMainMenu()
