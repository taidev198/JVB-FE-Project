// services/portalHomeApi.ts

import { RootState } from '@/store/store';
import { IFields } from '@/types';
import { IProvinceResponse } from '@/types/addressesTypes';
import { IAccountCompanyAllResponse, IAccountCompanyDetailResponse, ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
import { IFieldsPortal } from '@/types/fieldPortalHomeTypes';
import { IJobAllResponsePortal, IJobDetailResponse } from '@/types/jobCompany';
import { IJobByCompany } from '@/types/portalJobCompanyTypes';
import { UniversityDetailResponse, UniversityResponse } from '@/types/university';
import { WorkshopDetailResponse, WorkshopResponsePortal } from '@/types/workshop';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
      query: ({ id }) => `/portal/jobs/${id}`,
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
    getJobsCompany: builder.query<IJobByCompany, { companyId: number; page: number; size: number }>({
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
      query: ({ id }) => `/portal/workshops/${id}`,
    }),

    // Fetch specific jobs company
    getWorkshopsUniversity: builder.query<WorkshopResponsePortal, { universityId: number; page: number; size: number }>({
      query: ({ universityId, page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/workshops/${universityId}?${params.toString()}`;
      },
    }),

    // Fetch provinces
    getProvinces: builder.query<IProvinceResponse, void>({
      query: () => `/provinces`,
    }),

    // Fetch fields
    getFields: builder.query<IFields, void>({
      query: () => `/fields`,
    }),

    // Fetch fields count job
    getFieldsCountJob: builder.query<IFieldsPortal, void>({
      query: () => `/portal/fields/jobs`,
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
} = portalHomeApi;
