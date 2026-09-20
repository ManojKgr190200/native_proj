import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { api } from '../network/services/api';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import network, { resetApp } from './reducer/networkSlice';

const appreducer = combineReducers({
  [api.reducerPath]: api.reducer,
  network,
});

const rootReducer = (
  state: ReturnType<typeof appreducer> | undefined,
  action: any,
) => {
  if (action.type === resetApp.type) {
    return appreducer(undefined, action);
  }
  return appreducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof appreducer>;
export type AppDispatch = typeof store.dispatch;
