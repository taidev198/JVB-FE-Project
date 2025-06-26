import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ListeningPracticeResponseDto } from '@/types/listeningPractice';

export const listeningPracticeApi = createApi({
  reducerPath: 'listeningPracticeApi',
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
  tagTypes: ['ListeningPractice'],
  endpoints: builder => ({
    // Fetch listening practice by category
    getListeningPracticeByCategory: builder.query<{data : ListeningPracticeResponseDto[]}, { categoryId: number }>({
      query: ({ categoryId }) => `/listening-practices/${categoryId}?ts=${Date.now()}`,
      providesTags: (result, error, { categoryId }) => [
        { type: 'ListeningPractice', id: categoryId }
      ],
    }),

    // Fetch specific listening practice
    getListeningPracticeById: builder.query<{data:ListeningPracticeResponseDto}, { id: number }>({
      query: ({ id }) => `/listening-practice/${id}?ts=${Date.now()}`,
      providesTags: (result, error, { id }) => [
        { type: 'ListeningPractice', id }
      ],
    }),

    // Fetch all listening practices
    getAllListeningPractices: builder.query<{data:ListeningPracticeResponseDto[]}, void>({
      query: () => `/listening-practice?ts=${Date.now()}`,
      providesTags: ['ListeningPractice'],
    }),
  }),
});

export const {
  useGetListeningPracticeByCategoryQuery,
  useGetListeningPracticeByIdQuery,
  useGetAllListeningPracticesQuery,
} = listeningPracticeApi; 