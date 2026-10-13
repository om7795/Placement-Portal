import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import jobsReducer from '../features/jobsSlice.js';
import applicationsReducer from '../features/applicationsSlice.js';
import alumniReducer from '../features/alumniSlice.js';
import eventsReducer from '../features/eventsSlice.js';
import notificationsReducer from '../features/notificationsSlice.js';
import adminReducer from '../features/adminSlice.js';
import uiReducer from '../features/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    alumni: alumniReducer,
    events: eventsReducer,
    notifications: notificationsReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
