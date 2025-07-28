import { configureStore, ThunkAction, Action, AnyAction, Store } from '@reduxjs/toolkit'
import { Persistor, persistReducer, persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { createWrapper } from 'next-redux-wrapper'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import { createBlacklistFilter } from 'redux-persist-transform-filter'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import rootSagas from '@stores/sagas'
import rootReducers from '@stores/reducers/index'

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null)
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: any) {
      return Promise.resolve()
    }
  }
}
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const sagaMiddleware = createSagaMiddleware()
import axiosMiddleware from '@middleware/index'

export type RootReducer = ReturnType<typeof rootReducers>

//#region persis store

const encryptor: any = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_STORE_KEY ?? '',
  onError: function (error) {
    console.error(`createEncryptor error ${error}`)
  }
})

const saveAuthSubsetBlacklistFilter = createBlacklistFilter('', [])

const persistedReducer = persistReducer<RootReducer, AnyAction>(
  {
    key: 'root',
    storage,
    whitelist: ['auth'],
    transforms: [saveAuthSubsetBlacklistFilter, encryptor],
    version: 1
  },
  rootReducers
)

type PersistStore = {
  __PERSISTOR?: Persistor | any
} & Store<RootReducer, AnyAction>

//#endregion

export const store: PersistStore = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false
    })
    middlewares.push(sagaMiddleware)
    middlewares.push(axiosMiddleware)

    return middlewares
  },

  devTools: process.env.NODE_ENV !== 'production'
})

export type AppStore = typeof store
export type AppState = ReturnType<AppStore['getState']>

export type RootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>

export type AppDispatch = typeof store.dispatch

const makeStore = (): PersistStore => {
  const isServer = typeof window == 'undefined'
  if (isServer) {
    return configureStore({
      reducer: rootReducers
    })
  }

  store.__PERSISTOR = persistStore(store) // Nasty hack

  return store
}
sagaMiddleware.run(rootSagas)

export const wrapper = createWrapper(makeStore)
