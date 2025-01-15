// services/portalHomeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ProvinceResponse } from '@/types/addressesTypes';
import { IAccountCompanyAllResponse, IAccountCompanyDetailResponse } from '@/types/companyType';
import { FieldsResponse } from '@/types/fields';
import { IJobAllResponsePortal, IJobDetailResponse, IJobsData } from '@/types/jobCompany';
import { UniversityDetailResponse, UniversityResponse } from '@/types/university';
import { WorkshopDetailResponse, WorkshopResponsePortal } from '@/types/workshop';
import { FieldsResponsePortal } from '@/types/fieldPortalHomeTypes';
import { ChatResponse, chatRoomResponse } from '@/types/chatType';

export const portalHomeApi = createApi({
  reducerPath: 'portalHomeApi',
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
  tagTypes: ['WorkshopDetail', 'JobDetail', 'CompanyDetail', 'SchoolDetail'],
  endpoints: builder => ({
    // Fetch all jobs with pagination
    // Fetch all jobs with pagination and additional filters
    getJobs: builder.query<
      IJobAllResponsePortal,
      {
        page: number;
        size: number;
        keyword?: string;
        provinceId?: number;
        fieldId?: number;
        jobType?: string;
        salaryType?: string;
        jobLevel?: string;
        maxSalary?: number;
        minSalary?: number;
        universityId?: number;
      }
    >({
      query: ({ page, size, keyword = '', provinceId, fieldId, jobType, salaryType, jobLevel, maxSalary, minSalary, universityId }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
          keyword,
        });
        if (provinceId) params.append('provinceId', String(provinceId));
        if (fieldId) params.append('fieldId', String(fieldId));
        if (jobType) params.append('jobType', jobType);
        if (salaryType) params.append('salaryType', salaryType);
        if (jobLevel) params.append('jobLevel', jobLevel);
        if (maxSalary) params.append('maxSalary', String(maxSalary));
        if (minSalary) params.append('minSalary', String(minSalary));
        if (universityId) params.append('universityId', String(universityId));

        return `/portal/jobs?${params.toString()}`;
      },
    }),

    // Fetch specific job details
    getJobDetails: builder.query<IJobDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/jobs/detail/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'JobDetail', id }],
    }),

    // Fetch all companies with pagination
    getCompanies: builder.query<
      IAccountCompanyAllResponse,
      {
        page: number;
        size: number;
        keyword?: string;
        provinceIdSearch?: number;
        fieldId?: number;
        minQuantityEmployee?: number;
        maxQuantityEmployee?: number;
      }
    >({
      query: ({ page, size, keyword = '', provinceIdSearch, fieldId, minQuantityEmployee, maxQuantityEmployee }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        if (provinceIdSearch) params.append('provinceIdSearch', String(provinceIdSearch));
        if (fieldId) params.append('fieldId', String(fieldId));
        if (minQuantityEmployee) params.append('minQuantityEmployee', String(minQuantityEmployee));
        if (maxQuantityEmployee) params.append('maxQuantityEmployee', String(maxQuantityEmployee));
        return `/portal/company/get-all?${params.toString()}`;
      },
    }),

    // Fetch specific companies details
    getCompanyDetails: builder.query<IAccountCompanyDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/company/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'CompanyDetail', id }],
    }),

    // Fetch specific jobs company
    getJobsCompany: builder.query<IJobsData, { companyId: number; page: number; size: number }>({
      query: ({ companyId, page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/jobs/${companyId}?${params.toString()}`;
      },
    }),

    // Fetch all schools with pagination
    getSchools: builder.query<UniversityResponse, { page: number; size: number; keyword?: string; province?: number; field?: number }>({
      query: ({ page, size, keyword = '', province, field }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        if (province) params.append('province', String(province));
        if (field) params.append('fieldId', String(field));
        return `/portal/get_all_university?${params.toString()}`;
      },
    }),

    // Fetch specific school details
    getSchoolDetails: builder.query<UniversityDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/university/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'SchoolDetail', id }],
    }),

    // Fetch all workshops with pagination
    getWorkshops: builder.query<
      WorkshopResponsePortal,
      { page: number; size: number; keyword?: string; provinceId?: number; fieldId?: number; companyId?: number }
    >({
      query: ({ page, size, keyword = '', provinceId, fieldId, companyId }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        if (provinceId) {
          params.append('provinceId', String(provinceId));
        }
        if (fieldId) {
          params.append('fieldId', String(fieldId));
        }
        if (companyId) {
          params.append('companyId', String(companyId));
        }
        return `/portal/workshops?${params.toString()}`;
      },
    }),

    // Fetch specific workshop details
    getWorkshopDetails: builder.query<WorkshopDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/workshops/detail/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'WorkshopDetail', id }],
    }),

    // Fetch workshops by university
    getWorkshopsUniversity: builder.query<WorkshopResponsePortal, { universityId: number; page: number; size: number }>({
      query: ({ universityId, page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/workshops/${universityId}?${params.toString()}`;
      },
    }),

    // Fetch provinces
    getProvinces: builder.query<ProvinceResponse, void>({
      query: () => `/provinces`,
    }),

    // Fetch fields
    getFields: builder.query<FieldsResponse, void>({
      query: () => `/fields`,
    }),

    // Fetch fields count job
    getFieldsCountJob: builder.query<FieldsResponsePortal, void>({
      query: () => `/portal/field/jobs`,
    }),

    // Send connect
    sendConnect: builder.mutation({
      query: ({ accountLoginId, toDoAccountId, doBy, message }) => ({
        url: '/partnership/sendConnect',
        method: 'POST',
        body: { accountLoginId, toDoAccountId, doBy, message },
      }),
      invalidatesTags: (result, error, { toDoAccountId }) => [
        { type: 'CompanyDetail', id: toDoAccountId },
        { type: 'SchoolDetail', id: toDoAccountId },
      ],
    }),

    // Apply job
    sendApplyJob: builder.mutation<void, { major: number; job: number }>({
      query: ({ major, job }) => ({
        url: '/university/send_apply',
        method: 'POST',
        body: { major, job },
      }),
      invalidatesTags: (result, error, { job }) => [{ type: 'JobDetail', id: job }],
    }),

    // Apply workshop
    companyApplyWorkshop: builder.mutation({
      query: idWorkshop => ({
        url: `/company/workshop/apply/${idWorkshop}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, idWorkshop) => [{ type: 'WorkshopDetail', id: idWorkshop }],
    }),

    // Chat
    getAllChatRooms: builder.query<chatRoomResponse, { userId: number }>({
      query: ({ userId }) => {
        return {
          url: `/chat/chatroom`,
          method: 'GET',
          params: { userId },
        };
      },
    }),

    getAllMessages: builder.query<ChatResponse, { roomId: number; page: number; size: number }>({
      query: ({ roomId, page, size }) => ({
        url: `/chat/chatroom/${roomId}/messages`,
        method: 'GET',
        params: { page, size },
      }),
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobDetailsQuery,
  useGetWorkshopsQuery,
  useGetWorkshopDetailsQuery,
  useGetCompaniesQuery,
  useGetCompanyDetailsQuery,
  useGetProvincesQuery,
  useGetFieldsQuery,
  useGetSchoolsQuery,
  useGetJobsCompanyQuery,
  useGetSchoolDetailsQuery,
  useGetWorkshopsUniversityQuery,
  useGetFieldsCountJobQuery,
  useSendConnectMutation,
  useSendApplyJobMutation,
  useCompanyApplyWorkshopMutation,
  useGetAllChatRoomsQuery,
  useGetAllMessagesQuery,
} = portalHomeApi;
