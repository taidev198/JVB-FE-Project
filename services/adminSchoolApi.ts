import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';

export const adminSchoolApi = createApi({
  reducerPath: 'adminSchoolApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => {
    return {
      getAllWorShopsUniversity: builder.query<void, void>({
        query: () => ({
          url: '/university/workshops',
        }),
      }),
    };
  },
});

export const { useGetAllWorShopsUniversityQuery } = adminSchoolApi;
