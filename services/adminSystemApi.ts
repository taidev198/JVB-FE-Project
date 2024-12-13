/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { DistrictsResponse, ProvinceResponse, WardResponse } from '@/types/addressesTypes';
import { WorkshopDetailResponse, WorkshopResponse } from '@/types/workshop';
import { ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
import { UniversityResponse } from '@/types/university';

export const adminSystemApi = createApi({
  reducerPath: 'adminSystemApi',
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
  tagTypes: ['Workshop', 'Company'],
  endpoints: builder => {
    return {
      // Address
      getAllProvinces: builder.query<ProvinceResponse, void>({
        query: () => ({
          url: '/provinces',
        }),
      }),

      getAllDistricts: builder.query<DistrictsResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/districts/${id}`,
        }),
      }),

      getAllWards: builder.query<WardResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/wards/${id}`,
        }),
      }),

      // Auth
      registerUniversity: builder.mutation({
        query: payload => ({
          url: '/university/register',
          method: 'POST',
          body: payload,
        }),
      }),

      registerCompany: builder.mutation({
        query: payload => ({
          url: '/company/register',
          method: 'POST',
          body: payload,
        }),
      }),

      login: builder.mutation({
        query: payload => ({
          url: '/auth/login',
          method: 'POST',
          body: payload,
        }),
      }),

      changePassword: builder.mutation({
        query: payload => ({
          url: '/account/change-password',
          method: 'PUT',
          body: payload,
        }),
      }),

      confirmRegister: builder.query<{ code: number; message: string; data: null }, { uuid: string }>({
        query: ({ uuid }) => ({
          url: `/auth/confirm/${uuid}`,
          method: 'GET',
        }),
      }),

      // workshop
      getAllWorkShopsAdminSystem: builder.query<WorkshopResponse, { page: number; size: number; keyword: string; status: string }>({
        query: ({ page, size, keyword, status }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);

          return `/admin/workshops?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'Workshop', id: 'LIST' }],
      }),

      getDetailWorkshop: builder.query<WorkshopDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/workshops/${id}`,
        }),
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Workshop', id }] : []),
      }),

      // Approve workshop
      approveWorkshop: builder.mutation({
        query: ({ id }) => ({
          url: `/admin/workshops/approve/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Workshop', id },
                { type: 'Workshop', id: 'LIST' },
              ]
            : [{ type: 'Workshop', id: 'LIST' }];
        },
      }),

      // Reject workshop
      rejectWorkshop: builder.mutation({
        query: ({ id }) => ({
          url: `/admin/workshops/reject/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Workshop', id },
                { type: 'Workshop', id: 'LIST' },
              ]
            : [{ type: 'Workshop', id: 'LIST' }];
        },
      }),

      // Delete workshop
      deleteWorkshop: builder.mutation({
        query: ({ id }) => ({
          url: `/workshops/delete/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Workshop', id },
                { type: 'Workshop', id: 'LIST' },
              ]
            : [{ type: 'Workshop', id: 'LIST' }];
        },
      }),

      // Company
      getAllAccountCompany: builder.query<ICompanyAllResponse, { page: number; size: number; keyword: string; status: string }>({
        query: ({ page, size, keyword, status }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);

          return `/admin/get-all-companies?${queryParams.toString()}`;
        },
        providesTags: ['Company'],
      }),

      getDetailAccountCompany: builder.query<ICompanyDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/portal/company/${id}`,
        }),
        providesTags: result => (result ? [{ type: 'Company', id: result.data.account.id }] : [{ type: 'Company' }]),
      }),

      rejectAccountCompany: builder.mutation({
        query: ({ id }) => ({
          url: `/admin/reject/account/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }, { type: 'Company' }],
      }),

      banAndActive: builder.mutation<
        {
          code: number;
          message: string;
          data: any;
        },
        { id: number; statusAccount: string }
      >({
        query: ({ id, statusAccount }) => ({
          url: `/admin/update-account-status/${id}`,
          method: 'PUT',
          body: { statusAccount },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }, { type: 'Company' }],
      }),

      // Account School
      getAllAccountSchool: builder.query<UniversityResponse, { page: number; size: number; keyword: string; status: string; universityType: string }>({
        query: ({ page, size, keyword, status, universityType }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (universityType) queryParams.append('universityType', universityType);

          return `/admin/get-university?${queryParams.toString()}`;
        },
        providesTags: ['Company'],
      }),
    };
  },
});

export const {
  useGetAllProvincesQuery,
  useGetAllDistrictsQuery,
  useGetAllWardsQuery,
  useRegisterUniversityMutation,
  useRegisterCompanyMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useConfirmRegisterQuery,
  useGetAllWorkShopsAdminSystemQuery,
  useLazyGetAllWorkShopsAdminSystemQuery,
  useGetDetailWorkshopQuery,
  useApproveWorkshopMutation,
  useRejectWorkshopMutation,
  useDeleteWorkshopMutation,
  useGetAllAccountCompanyQuery,
  useGetDetailAccountCompanyQuery,
  useRejectAccountCompanyMutation,
  useBanAndActiveMutation,
  useGetAllAccountSchoolQuery,
} = adminSystemApi;
