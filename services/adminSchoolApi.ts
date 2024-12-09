import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ApiResponse, IDepartment } from '@/types/departmentType';

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
      getAllDepartments: builder.query<ApiResponse<IDepartment[]>, void>({
        query: () => ({
          url: '/portal/faculties/get-all',
        }),
      }),

      detailDepartments: builder.query<ApiResponse<IDepartment[]>, { id: number }>({
        query: ({ id }) => ({
          url: `/university/faculties/${id}`, // Sử dụng cú pháp template string đúng
        }),
      }),
      getAllWorShopsUniversity: builder.query<void, void>({
        query: () => ({
          url: '/university/workshops',
        }),
      }),
    };
  },
});

export const { useGetAllWorShopsUniversityQuery, useGetAllDepartmentsQuery, useDetailDepartmentsQuery } = adminSchoolApi;
