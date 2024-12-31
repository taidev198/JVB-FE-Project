import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
import { IProfileCompanyRespone } from '@/types/profileCompany';
import { IJobAllResponse, IJobDetailResponse, IJobUniversityApply } from '@/types/jobCompany';
import { WorkshopResponseCompany } from '@/types/workshop';
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
  tagTypes: ['Workshop', 'Company', 'JobCompany', 'Profile', 'UniversityApply'],
  endpoints: builder => {
    return {
      getAllWorShopsUniversity: builder.query<void, void>({
        query: () => ({
          url: '/university/workshops',
        }),
      }),

      //employe
      getAllCompanyEmploye: builder.query<
        ICompanyAllResponse,
        { page: number; size: number; keyword: string; status: string; startDate: Date | null; endDate: Date | null }
      >({
        query: ({ page, size, keyword, status, startDate, endDate }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');

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

      deleteAllEmployeeCompany: builder.mutation<void, { ids: number[] }>({
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
        providesTags: [{ type: 'Profile' }],
      }),

      updateProfile: builder.mutation({
        query: (args: { formData: FormData }) => ({
          url: `/company/update-current`,
          method: 'PUT',
          body: args.formData,
        }),
        invalidatesTags: ['Profile'],
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
        providesTags: [{ type: 'JobCompany' }],
      }),

      getDetailCompanyJob: builder.query<IJobDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/company/get_detail/${id}`,
        }),
        providesTags: [{ type: 'JobCompany' }],
      }),

      deleteJobCompany: builder.mutation({
        query: ({ id }) => ({
          url: `/delete_job/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: () => [{ type: 'JobCompany' }],
      }),

      deleteAllJobCompany: builder.mutation<void, { ids: number[] }>({
        query: ids => ({
          url: `/delete_multi_job`,
          method: 'DELETE',
          body: ids,
        }),
        invalidatesTags: () => [{ type: 'JobCompany' }],
      }),

      addJob: builder.mutation({
        query: data => ({
          url: `/company/create_job`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: [{ type: 'JobCompany' }],
      }),

      updateJob: builder.mutation({
        query: ({ data, id }) => ({
          url: `/company/update_job/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: result => [{ type: 'JobCompany', id: result.data.id }, { type: 'JobCompany' }],
      }),

      // WORKSHOP
      getAllWorkShopCompany: builder.query<
        WorkshopResponseCompany,
        {
          page: number;
          size: number;
          keyword: string;
          status: string;
          startDate: Date | null;
          endDate: Date | null;
        }
      >({
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

      // SchoolApplyJob
      getAllJobAppliesCompany: builder.query<
        IJobUniversityApply,
        {
          page: number | null;
          size: number | null;
          keyword: string;
          companyId: number | undefined;
          status: string;
        }
      >({
        query: ({ page, size, keyword, companyId, status }) => {
          let queryParams = new URLSearchParams();
          if (companyId) queryParams.append('companyId', String(companyId));
          if (keyword) queryParams.append('keyword', keyword);
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (status) queryParams.append('status', status);
          return `/company/applies?${queryParams.toString()}`;
        },
        providesTags: ['UniversityApply'],
      }),

      acceptJobsForUniversity: builder.mutation({
        query: ({ major, job }) => ({
          url: `/company/accept_apply`,
          method: 'POST',
          body: { major, job },
        }),
        invalidatesTags: (result, error, { job }) => [{ type: 'UniversityApply', job }, { type: 'UniversityApply' }],
      }),

      cancelJobsForUniversity: builder.mutation({
        query: ({ major, job }) => ({
          url: `/company/cancel_apply`,
          method: 'POST',
          body: { major, job },
        }),
        invalidatesTags: (result, error, { acceptToAccountId }) => [{ type: 'UniversityApply', acceptToAccountId }, { type: 'UniversityApply' }],
      }),

      removeJobsForUniversity: builder.mutation({
        query: ({ major, job }) => ({
          url: `/remove_apply`,
          method: 'POST',
          body: { major, job },
        }),
        invalidatesTags: (result, error, { acceptToAccountId }) => [{ type: 'UniversityApply', acceptToAccountId }, { type: 'UniversityApply' }],
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
  useUpdateProfileMutation,
  useGetAllCompanyJobQuery,
  useGetDetailCompanyJobQuery,
  useDeleteJobCompanyMutation,
  useGetAllWorkShopCompanyQuery,
  useDeleteWorkShopMutation,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteAllJobCompanyMutation,
  useGetAllJobAppliesCompanyQuery,
  useAcceptJobsForUniversityMutation,
  useCancelJobsForUniversityMutation,
  useRemoveJobsForUniversityMutation,
} = adminCompanyApi;
