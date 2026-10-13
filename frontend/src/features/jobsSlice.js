import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobApi } from '../api/index.js';

export const fetchJobs = createAsyncThunk('jobs/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    return await jobApi.list(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchJob = createAsyncThunk('jobs/fetchOne', async (id, { rejectWithValue }) => {
  try {
    return await jobApi.get(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createJob = createAsyncThunk('jobs/create', async (payload, { rejectWithValue }) => {
  try {
    return await jobApi.create(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyJobs = createAsyncThunk('jobs/mine', async (_, { rejectWithValue }) => {
  try {
    return await jobApi.mine();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  items: [],
  current: null,
  currentEligibility: null,
  myJobs: [],
  meta: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.currentEligibility = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data.job;
        state.currentEligibility = action.payload.data.eligibility;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
        state.myJobs.unshift(action.payload.data);
      })

      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.myJobs = action.payload.data;
      });
  },
});

export const { clearCurrent } = jobsSlice.actions;
export default jobsSlice.reducer;
