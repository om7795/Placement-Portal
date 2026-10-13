import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationApi } from '../api/index.js';

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async (payload, { rejectWithValue }) => {
    try {
      return await applicationApi.apply(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  'applications/mine',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationApi.mine();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'applications/forJob',
  async (jobId, { rejectWithValue }) => {
    try {
      return await applicationApi.forJob(jobId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      return await applicationApi.updateStatus(id, { status, note });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async (id, { rejectWithValue }) => {
    try {
      return await applicationApi.withdraw(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  mine: [],
  forJob: [],
  loading: false,
  error: null,
  lastAction: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearAction(state) {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload.data;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.mine.unshift(action.payload.data);
        state.lastAction = 'applied';
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.forJob = action.payload.data;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.forJob = state.forJob.map((a) => (a._id === updated._id ? updated : a));
      })

      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.mine = state.mine.map((a) => (a._id === updated._id ? updated : a));
      });
  },
});

export const { clearAction } = applicationsSlice.actions;
export default applicationsSlice.reducer;
