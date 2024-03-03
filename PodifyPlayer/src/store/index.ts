import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducers from './auth';
import notificationReducer from './notification';

const reducer = combineReducers({
  auth: authReducers,
  notification: notificationReducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
