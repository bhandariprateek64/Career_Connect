import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: null, // Lowercase 'user'
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload; // Ensure correct structure from API
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
