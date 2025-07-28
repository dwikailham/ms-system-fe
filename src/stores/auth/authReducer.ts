import { createSlice } from '@reduxjs/toolkit'
import initialState from './authInitialState'

const AuthSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    authSetToken: (state, action) => {
      return {
        ...state,
        ...action.payload.data,
        isLogin: true,
        action: action.type
      }
    },
    updateToken: (state, action) => {
      return {
        ...state,
        token: action.payload,
        isLogin: true,
        action: action.type
      }
    },
    authLogout: (state, action) => {
      return {
        ...state,
        user_data: {
          name: '',
          username: '',
          role: '',
          uuid: ''
        },
        token: '',

        isLogin: false,
        action: action.type
      }
    },
    authSetAcls: (state, action) => {
      return {
        ...state,
        userAccess: action.payload,
        isLogin: true,
        action: action.type
      }
    }
  }
})

export const { name, actions, reducer } = AuthSlice
