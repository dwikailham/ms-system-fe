import { combineReducers } from '@reduxjs/toolkit'
import { reducer as CoreAuthReducer } from '../auth/authReducer'

const rootReducers = combineReducers({
  auth: CoreAuthReducer
})

export default rootReducers
