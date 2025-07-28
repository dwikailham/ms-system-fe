export type IStateAuth = {
  user_data: {
    name: string
    username: string
    role: string
    uuid: string
  }
  token: string

  action: string
  isLogin: boolean
}
