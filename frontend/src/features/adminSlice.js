import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../api/index.js';

export const fetchStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
  try {
    return await adminApi.stats();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  stats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
