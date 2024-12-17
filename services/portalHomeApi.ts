import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IJobAllResponse, IJobDetailResponse } from '@/types/jobCompany';
import { WorkshopResponse, WorkshopDetailResponse } from '@/types/workshop';
import { ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
import { IProvinceResponse } from '@/types/addressesTypes';
import { RootState } from '@/store/store';

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
    getJobs: builder.query<IJobAllResponse, { page: number; size: number }>({
      query: ({ page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/jobs?${params.toString()}`;
      },
    }),

    // Fetch specific job details
    getJobDetails: builder.query<IJobDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/jobs/${id}`,
    }),

    // Fetch all companies with pagination
    getCompanies: builder.query<ICompanyAllResponse, { page: number; size: number; keyword?: string }>({
      query: ({ page, size, keyword = '' }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size), keyword });
        return `/portal/company/get-all?${params.toString()}`;
      },
    }),

    // Fetch specific companies details
    getCompanyDetails: builder.query<ICompanyDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/companies/${id}`,
    }),

    // Fetch all workshops with pagination
    getWorkshops: builder.query<WorkshopResponse, { page: number; size: number }>({
      query: ({ page, size }) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return `/portal/workshops?${params.toString()}`;
      },
    }),

    // Fetch specific workshop details
    getWorkshopDetails: builder.query<WorkshopDetailResponse, { id: number }>({
      query: ({ id }) => `/portal/workshops/${id}`,
    }),

    // Fetch provinces
    getProvinces: builder.query<IProvinceResponse, void>({
      query: () => `/provinces`,
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
} = portalHomeApi;
