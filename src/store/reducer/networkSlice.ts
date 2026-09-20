import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';

export const appForegrounded = createAction('network/appForegrounded');
export const drainRequested = createAction('outbox/drainRequested');
export const resetApp = createAction('app/reset');

type NetworkState = {
  isOnline: boolean;
  isDraining: boolean;
};

const initialState: NetworkState = {
  isOnline: true,
  isDraining: false,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    connectivityChanged: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    drainingChanged: (state, action: PayloadAction<boolean>) => {
      state.isDraining = action.payload;
    },
  },
});

export const { connectivityChanged, drainingChanged } = networkSlice.actions;

export default networkSlice.reducer;
