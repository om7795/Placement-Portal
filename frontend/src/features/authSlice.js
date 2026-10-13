import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/index.js';

const storedUser = localStorage.getItem('user');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateMe = createAsyncThunk('auth/updateMe', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.updateMe(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  profile: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    };

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(login.rejected, rejected)

      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(register.rejected, rejected)

      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.data.user;
        state.profile = action.payload.data.profile;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })

      .addCase(updateMe.fulfilled, (state, action) => {
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
