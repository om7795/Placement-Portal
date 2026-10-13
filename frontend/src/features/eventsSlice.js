import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventApi } from '../api/index.js';

export const fetchEvents = createAsyncThunk('events/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    return await eventApi.list(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createEvent = createAsyncThunk('events/create', async (payload, { rejectWithValue }) => {
  try {
    return await eventApi.create(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleRegister = createAsyncThunk(
  'events/toggleRegister',
  async (id, { rejectWithValue }) => {
    try {
      return await eventApi.toggleRegister(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  meta: { total: 0, page: 1, pages: 1 },
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
      });
  },
});

export default eventsSlice.reducer;
