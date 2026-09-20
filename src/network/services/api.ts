import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as Keychain from 'react-native-keychain';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.myapp.com',
    prepareHeaders: async headers => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        headers.set('Authorization', `Bearer ${credentials.password}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
