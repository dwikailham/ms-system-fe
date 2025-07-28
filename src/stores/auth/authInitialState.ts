import { IStateAuth } from './types'

const initialState: IStateAuth = {
  user_data: {
    name: '',
    username: '',
    role: '',
    uuid: ''
  },
  token: '',

  action: '',
  isLogin: false
}

export default initialState
