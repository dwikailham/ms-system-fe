import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  actions: string
  type: 'success' | 'error' | 'warning' | 'info'
  msg: string
}
interface IPayloadAlert {
  type: 'success' | 'error' | 'warning' | 'info'
  msg: string
}
const initState: IState = {
  actions: '',
  type: 'info',
  msg: ''
}

const UtilsSlice = createSlice({
  name: 'UTILS',
  initialState: initState,
  reducers: {
    UtilsShowAlert: (state, action: PayloadAction<IPayloadAlert>) => {
      const { type, payload } = action
      state.actions = type
      state.msg = payload.msg
      state.type = payload.type
    },
    UtilsResetAlert() {
      return {
        ...initState
      }
    }
  }
})

export const { name, actions, reducer } = UtilsSlice
