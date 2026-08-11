import { MainLayoutMenu } from './MainLayout.types'

function normalizePathname(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0]
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}

export function getMenuHref(defaultLink: string, url: string): string {
  return `/${defaultLink}/${url}`
}

export function isMenuLinkActive(pathname: string, href: string): boolean {
  return normalizePathname(pathname) === normalizePathname(href)
}

export function getActiveMenuName(items: MainLayoutMenu[], pathname: string): string | null {
  const exactItem = items.find(({ defaultLink, subMenu }) =>
    subMenu.some(({ url }) => isMenuLinkActive(pathname, getMenuHref(defaultLink, url)))
  )
  if (exactItem) return exactItem.name
  const normalized = normalizePathname(pathname)
  return items.find(({ defaultLink }) => normalized.startsWith(`/${defaultLink}/`))?.name ?? null
}
