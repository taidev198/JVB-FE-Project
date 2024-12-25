import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
// import { number } from 'yup';
import { IProfileCompany, IProfileCompanyRespone } from '@/types/profileCompany';
import { IJobAllResponse, IJobDetailResponse } from '@/types/jobCompany';
// import { method, result } from 'lodash';
// import { error } from 'console';
import { WorkshopResponse } from '@/types/workshop';
import { formatDateSearch } from '@/utils/app/format';

export const adminCompanyApi = createApi({
  reducerPath: 'adminCompanyApi',
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
  tagTypes: ['Workshop', 'Company', 'Job'],
  endpoints: builder => {
    return {
      getAllWorShopsUniversity: builder.query<void, void>({
        query: () => ({
          url: '/university/workshops',
        }),
      }),

      //employe
      getAllCompanyEmploye: builder.query<ICompanyAllResponse, { page: number; size: number; keyword: string; status: string }>({
        query: ({ page, size, keyword, status }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);

          return `/company/company-employees?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'Company', id: 'LIST' }], // Liên kết tag này với getAllDepartments
      }),

      getDetailEmployee: builder.query<ICompanyDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/company/company-employees/${id}`,
        }),
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Company', id }] : []),
      }),

      addEmployee: builder.mutation({
        query: data => ({
          url: `/company/company-employees/create`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Company'],
      }),

      updateEmployee: builder.mutation({
        query: ({ formData, id }) => ({
          url: `/company/company-employees/update/${id}`,
          method: 'PUT',
          body: formData,
        }),
        invalidatesTags: ['Company'],
      }),

      deleteEmployeeCompany: builder.mutation({
        query: ({ id }) => ({
          url: `/company/company-employees/delete/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: [{ type: 'Company' }],
      }),

      deleteAllEmployeeCompany: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/company/company-employees/delete-multiple`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: [{ type: 'Company' }],
      }),

      //profile Company
      getDetailProfile: builder.query<IProfileCompanyRespone, void>({
        query: () => ({
          url: `/company/detail-current`,
        }),
      }),

      updateProfile: builder.mutation<any, { data: any; id: number | null }>({
        query: ({ data, id }) => ({
          url: `/company/update-current`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Job'],
      }),

      //JOBCOMPANY
      getAllCompanyJob: builder.query<IJobAllResponse, { page: number; size: number; keyword: string; status: string }>({
        query: ({ page, size, keyword, status }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);

          return `/company/get_all_jobs?${queryParams.toString()}`;
        },
        providesTags: ['Job'],
      }),
      getDetailCompanyJob: builder.query<IJobDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/company/get_detail/${id}`,
        }),
        // providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Employee', id }] : []),
      }),
      deleteJobCompany: builder.mutation({
        query: ({ id }) => ({
          url: `/delete_job/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Job' }],
      }),
      deleteAllJobCompany: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/company/delete_multi_job`,
          method: 'DELETE',
          body: { ids },
        }),
        invalidatesTags: [{ type: 'Job' }],
      }),
      addJob: builder.mutation({
        query: data => ({
          url: `/company/create_job`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Job'],
      }),

      updateJob: builder.mutation<any, { data: any; id: number | null }>({
        query: ({ data, id }) => ({
          url: `/company/update_job/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Job'],
      }),

      // WORKSHOP
      getAllWorkShopCompany: builder.query<WorkshopResponse, { page: number; size: number; keyword: string; status: string; startDate: Date | null; endDate: Date | null;}>({
        query: ({ page, size, keyword, status, startDate, endDate }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');
          return `/company/workshop/apply/get_all?${queryParams.toString()}`;
        },
        providesTags: ['Workshop'],
      }),
      deleteWorkShop: builder.mutation({
        query: ({ id }) => ({
          url: `/company/workshop/cancel/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Workshop' }],
      }),
    };
  },
});

export const {
  useGetAllWorShopsUniversityQuery,
  useGetAllCompanyEmployeQuery,
  useGetDetailEmployeeQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeCompanyMutation,
  useDeleteAllEmployeeCompanyMutation,
  useGetDetailProfileQuery,
  useGetAllCompanyJobQuery,
  useGetDetailCompanyJobQuery,
  useDeleteJobCompanyMutation,
  useGetAllWorkShopCompanyQuery,
  useDeleteWorkShopMutation,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteAllJobCompanyMutation,
} = adminCompanyApi;
