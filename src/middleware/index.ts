/* eslint-disable no-unsafe-finally */
import { actions as utilActions } from '@stores/utils'
import { AxiosError } from 'axios'
import notification from '@utils/notification'
import { toTitleCaseSentence } from '@utils/commons'
import { HttpClient } from '@utils/httpClient'
import { actions as CoreAuthActions } from '@stores/auth/authReducer'
import { store } from '@configs/stores'

type IErrorParse = {
  status: number
  message: string
  error: string
}

function createAxiosAuthMiddleware() {
  return ({ getState }: any) =>
    (next: any) =>
    (action: any) => {
      //refresh token

      // #region show alert success and warning
      if (action.type === utilActions.UtilsShowAlert.type) {
        const { type, msg } = action.payload
        console.log('msg>>', msg)

        // notification({ type: 'success', text: 'message' });
        if (!['token'].includes(msg?.toString().toLowerCase())) {
          notification({ type, text: msg })
        }
      }

      // #endregion

      HttpClient.interceptors.request.use((request: any) => {
        const auth = getState().auth
        request.baseURL = process.env.NEXT_PUBLIC_BASE_URL

        // inject token
        if (auth.isLogin && request?.url !== '/api/v1/auth/refreshToken') {
          request.headers['Authorization'] = `Bearer ${auth.token}`
        }

        return request
      })

      HttpClient.interceptors.response.use(
        (response: any) => {
          return response
        },
        (error: any) => {
          const {} = getState().auth

          // store.dispatch(CoreAuthActions.authLogout({}))

          const errMessage = JSON.stringify((error as AxiosError)?.response?.data)

          if (errMessage && !error.isErrorMessageToasted) {
            const errorParse: IErrorParse = JSON.parse(errMessage)
            console.log('errorParse', errorParse?.error)

            if (errorParse?.message) {
              error.isErrorMessageToasted = true
              notification({ type: 'error', text: toTitleCaseSentence(errorParse?.message) })
            }
          }

          // if (error.response?.status === 401 && !originalRequest._retry) {
          //   store.dispatch(CoreAuthActions.authLogout({}))
          // }
          // #region refresh token
          // const originalRequest = errorParseOriginal.config
          // console.log('originalRequest>>', errorParseOriginal)
          if (error?.response && error?.response?.status === 401) {
            store.dispatch(CoreAuthActions.authLogout({}))
            setTimeout(() => {
              window.location.href = '/'
            }, 2000)
          } else {
            return Promise.reject(error)
          }

          // #endregion
        }
      )

      return next(action)
    }
}

const axiosAuth = createAxiosAuthMiddleware()

export default axiosAuth
