// services/portalHomeApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ProvinceResponse } from '@/types/addressesTypes';
import { IAccountCompanyAllResponse, IAccountCompanyDetailResponse } from '@/types/companyType';
import { FieldsResponsePortal, IFieldsPortal } from '@/types/fieldPortalHomeTypes';
import { FieldsResponse } from '@/types/fields';
import { IJobAllResponsePortal, IJobByCompanyResponse, IJobDetailResponse } from '@/types/jobCompany';
import { UniversityDetailResponse, UniversityResponse } from '@/types/university';
import { WorkshopDetailResponse, WorkshopResponsePortal } from '@/types/workshop';

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
  endpoints: builder => ({
    // Fetch all jobs with pagination
    getJobs: builder.query<IJobAllResponsePortal, { page: number; size: number; keyword?: string }>({
      query: ({ page, size, keyword = '' }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        return `/portal/jobs?${params.toString()}`;
      },
    }),

    // Fetch specific job details
    getJobDetails: builder.query<IJobDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/jobs/detail/${id}`,
    }),

    // Fetch all companies with pagination
    getCompanies: builder.query<IAccountCompanyAllResponse, { page: number; size: number; keyword?: string }>({
      query: ({ page, size, keyword = '' }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        return `/portal/company/get-all?${params.toString()}`;
      },
    }),

    // Fetch specific companies details
    getCompanyDetails: builder.query<IAccountCompanyDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/company/${id}`,
    }),

    // Fetch specific jobs company
    getJobsCompany: builder.query<IJobByCompanyResponse, { companyId: number; page: number; size: number }>({
      query: ({ companyId, page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/jobs/${companyId}?${params.toString()}`;
      },
    }),

    // Fetch all schools with pagination
    getSchools: builder.query<UniversityResponse, { page: number; size: number; keyword?: string }>({
      query: ({ page, size, keyword = '' }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        return `/portal/get_all_unis?${params.toString()}`;
      },
    }),

    // Fetch specific school details
    getSchoolDetails: builder.query<UniversityDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/university/${id}`,
    }),

    // Fetch all workshops with pagination
    getWorkshops: builder.query<WorkshopResponsePortal, { page: number; size: number; keyword?: string }>({
      query: ({ page, size, keyword = '' }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        return `/portal/workshops?${params.toString()}`;
      },
    }),

    // Fetch specific workshop details
    getWorkshopDetails: builder.query<WorkshopDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/workshops/detail/${id}`,
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
} = portalHomeApi;
