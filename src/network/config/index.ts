import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import { setupListeners } from '@reduxjs/toolkit/query';
import { store } from '../../store';
import {
  connectivityChanged,
  appForegrounded,
} from '../../store/reducer/networkSlice';

const isOnline = (s: NetInfoState) =>
  !!s.isConnected && s.isInternetReachable !== false;

export const initConnectivity = () =>
  setupListeners(
    store.dispatch,
    (dispatch, { onOnline, onOffline, onFocus, onFocusLost }) => {
      const unsubscribeNet = NetInfo.addEventListener(state => {
        const online = isOnline(state);
        dispatch(connectivityChanged(online));
        dispatch(online ? onOnline() : onOffline());
      });

      const appStateSub = AppState.addEventListener(
        'change',
        (status: AppStateStatus) => {
          if (status === 'active') {
            dispatch(onFocus());
            dispatch(appForegrounded());
          } else {
            dispatch(onFocusLost());
          }
        },
      );

      return () => {
        unsubscribeNet();
        appStateSub.remove();
      };
    },
  );
