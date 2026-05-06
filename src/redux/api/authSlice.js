import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: 'Admin User',
    role: 'admin',
    email: 'admin@onemart.com'
  },
  token: 'dummy-token',
  isAuthenticated: true,
  loading: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

// Mock permission selector
export const selectHasPermission = (state) => (module, action) => {
  // For now, allow everything to restore the original design experience
  return true
}
