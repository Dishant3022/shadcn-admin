import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/lib/axios'

interface User {
  _id: string
  name: string
  email: string
  role: string
  organizationId: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
}

// Create async thunk for login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })
      if (response.data.success) {
        return response.data.data
      }
      return rejectWithValue(response.data.message || 'Login failed')
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null
      state.token = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.loading = false
        state.error = null
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Login failed'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
