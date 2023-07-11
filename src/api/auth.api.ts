import { httpApi } from '@app/api/http.api'
// import './mocks/auth.api.mock';
import { UserModel } from '@app/domain/UserModel'

export interface AuthData {
  email: string
  password: string
}

export interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface SignUpRequest2 {
  firstName: string
  lastName: string
  email: string
  password: string
  custome?: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface SecurityCodePayload {
  code: string
}

export interface NewPasswordData {
  newPassword: string
  code: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserModel
}

export const deleteUser = (user: string): Promise<any> =>
  httpApi.delete<any>(`api/users/${user}`).then(({ data }) => data)

export const login = (loginPayload: LoginRequest): Promise<LoginResponse> =>
  httpApi
    .post<LoginResponse>('api/auth/signin', { ...loginPayload })
    .then(({ data }) => data)

export const signUp = (signUpData: SignUpRequest2): Promise<undefined> =>
  httpApi
    .post<undefined>('api/users', { ...signUpData })
    .then(({ data }) => data)

export const resetPassword = (
  resetPasswordPayload: ResetPasswordRequest
): Promise<undefined> =>
  httpApi
    .post<undefined>('api/auth/forgot-password', { ...resetPasswordPayload })
    .then(({ data }) => data)

export const verifySecurityCode = (
  securityCodePayload: SecurityCodePayload
): Promise<undefined> =>
  httpApi
    .post<undefined>('api/auth/verify-otp', { ...securityCodePayload })
    .then(({ data }) => data)

export const setNewPassword = (
  newPasswordData: NewPasswordData
): Promise<undefined> =>
  httpApi
    .put<undefined>(
      `api/auth/new-password${
        newPasswordData.code ? `/${newPasswordData.code}` : ''
      }`,
      {
        ...newPasswordData
      }
    )
    .then(({ data }) => data)
