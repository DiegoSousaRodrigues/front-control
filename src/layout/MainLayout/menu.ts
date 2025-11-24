import { IconType } from 'react-icons'
import { MdListAlt, MdOutlinePersonOutline, MdOutlineShoppingCart } from 'react-icons/md'
import { MainLayoutMenu } from './MainLayout.types'

export const icons = new Map<string, IconType>([
  ['person', MdOutlinePersonOutline],
  ['order', MdListAlt],
  ['products', MdOutlineShoppingCart],
])

export const menu = [
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
  {
    icon: 'order',
    name: 'Pedidos',
    defaultLink: 'order',
    subMenu: [
      {
        name: 'Cadastrar',
        url: 'add',
      },
      {
        name: 'Listar',
        url: 'list',
      },
      {
        name: 'Sequencia',
        url: 'queue',
      },
    ],
  },
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
] as MainLayoutMenu[]
