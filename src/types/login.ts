export type User = {
  token: string
  user: UserProps
}

export type UserProps = {
  id: number
  name: string
  login: string
}
