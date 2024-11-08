export type MainLayoutMenu = {
  name: string
  icon: string
  defaultLink: string
  subMenu: SubMenu[]
}

export type SubMenu = {
  name: string
  url: string
}
