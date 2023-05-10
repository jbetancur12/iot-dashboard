import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  HeadersDefaults
} from 'axios'
import { AxiosError } from 'axios'
import { ApiError } from '@app/api/ApiError'
import {
  persistRefreshToken,
  persistToken,
  readRefreshToken,
  readToken
} from '@app/services/localStorage.service'
import { notificationController } from '@app/controllers/notificationController'

interface CommonHeaderProperties extends AxiosRequestHeaders {
  'x-access-token': string
}

interface test extends AxiosRequestConfig {
  _retry: boolean
}

export const httpApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

httpApi.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${readToken()}`,
    'x-access-token': readToken()
  } as CommonHeaderProperties
  return config
})

httpApi.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalConfig = error.config as test
  originalConfig._retry = false
  if (originalConfig.url !== 'api/auth/signin' && error.response) {
    if (error.response.status === 401 && !originalConfig._retry) {
      console.log(originalConfig._retry)
      originalConfig._retry = true

      try {
        const rs = await httpApi.post('api/auth/refreshtoken', {
          refreshToken: readRefreshToken()
        })

        console.log(rs)

        const { accessToken } = rs.data

        //dispatch(refreshToken(accessToken));
        persistToken(accessToken)

        return httpApi(originalConfig)
      } catch (_error: any) {
        console.log(_error)
        return Promise.reject(_error)
      }
    } else if (error.response.status === 403) {
      //notificationController.info({message:"Su sesión ha expirado, por favor vuelva a iniciar sesión"});
      window.location.href = '/auth/login'
    }
  }
  throw new ApiError<ApiErrorData>(
    error.response?.data.message || error.message,
    error.response?.data
  )
})

export interface ApiErrorData {
  message: string
}
