import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const storedUser = localStorage.getItem('user');
const storedAccessToken = localStorage.getItem('access_token');
const storedRefreshToken = localStorage.getItem('refresh_token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; access: string; refresh: string }>
    ) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;