import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ResetPasswordRequest,
  login,
  LoginRequest,
  signUp,
  SignUpRequest,
  SignUpRequest2,
  resetPassword,
  verifySecurityCode,
  SecurityCodePayload,
  NewPasswordData,
  setNewPassword,
} from '@app/api/auth.api';
import { setUser } from '@app/store/slices/userSlice';
import {
  deleteToken,
  deleteUser,
  persistRefreshToken,
  persistToken,
  readToken,
} from '@app/services/localStorage.service';

export interface AuthSlice {
  accessToken: string | null;
}

const initialState: AuthSlice = {
  accessToken: readToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest, { dispatch }) =>
  login(loginPayload).then((res) => {
    dispatch(setUser(res.user));
    persistToken(res.accessToken);
    persistRefreshToken(res.refreshToken);

    return res.accessToken;
  }),
);

export const doSignUp = createAsyncThunk('auth/doSignUp', async (signUpPayload: SignUpRequest2) =>
  signUp(signUpPayload),
);

export const doResetPassword = createAsyncThunk(
  'auth/doResetPassword',
  async (resetPassPayload: ResetPasswordRequest) => resetPassword(resetPassPayload),
);

export const doVerifySecurityCode = createAsyncThunk(
  'auth/doVerifySecurityCode',
  async (securityCodePayload: SecurityCodePayload) => verifySecurityCode(securityCodePayload),
);

export const doSetNewPassword = createAsyncThunk('auth/doSetNewPassword', async (newPasswordData: NewPasswordData) =>
  setNewPassword(newPasswordData),
);

export const doLogout = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteToken();
  deleteUser();
  dispatch(setUser(null));
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.accessToken = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.accessToken = '';
    });
  },
});

export default authSlice.reducer;
