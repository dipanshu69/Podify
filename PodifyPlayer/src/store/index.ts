import {configureStore} from '@reduxjs/toolkit';
import authReducers from './auth';

const store = configureStore({
  reducer: authReducers,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
