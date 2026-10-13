import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { alumniApi, mentorshipApi } from '../api/index.js';

export const fetchAlumni = createAsyncThunk('alumni/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    return await alumniApi.list(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMentors = createAsyncThunk('alumni/mentors', async (_, { rejectWithValue }) => {
  try {
    return await alumniApi.mentors();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchPendingAlumni = createAsyncThunk(
  'alumni/pending',
  async (_, { rejectWithValue }) => {
    try {
      return await alumniApi.pending();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const approveAlumni = createAsyncThunk(
  'alumni/approve',
  async (userId, { rejectWithValue }) => {
    try {
      return await alumniApi.approve(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const requestMentorship = createAsyncThunk(
  'alumni/requestMentorship',
  async (payload, { rejectWithValue }) => {
    try {
      return await mentorshipApi.create(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyMentorship = createAsyncThunk(
  'alumni/myMentorship',
  async (_, { rejectWithValue }) => {
    try {
      return await mentorshipApi.mine();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const respondMentorship = createAsyncThunk(
  'alumni/respondMentorship',
  async ({ id, status, response, scheduledAt }, { rejectWithValue }) => {
    try {
      return await mentorshipApi.respond(id, { status, response, scheduledAt });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [],
  mentors: [],
  pending: [],
  mentorship: [],
  meta: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
};

const alumniSlice = createSlice({
  name: 'alumni',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlumni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlumni.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAlumni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.mentors = action.payload.data;
      })

      .addCase(fetchPendingAlumni.fulfilled, (state, action) => {
        state.pending = action.payload.data;
      })

      .addCase(approveAlumni.fulfilled, (state, action) => {
        state.pending = state.pending.filter((u) => u._id !== action.payload.data.id);
      })

      .addCase(fetchMyMentorship.fulfilled, (state, action) => {
        state.mentorship = action.payload.data;
      })

      .addCase(respondMentorship.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.mentorship = state.mentorship.map((m) => (m._id === updated._id ? updated : m));
      });
  },
});

export default alumniSlice.reducer;
