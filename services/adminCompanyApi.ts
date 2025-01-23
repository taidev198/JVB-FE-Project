import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { persistor, RootState } from '@/store/store';
import { ICompanyAllResponse, ICompanyDetailResponse } from '@/types/companyType';
import { IProfileCompanyRespone } from '@/types/profileCompany';
import { IJobAllResponse, IJobDetailResponse, IJobUniversityApply, IStudentApplyJobResponse, StudentApplyJobResponse } from '@/types/jobCompany';
import { WorkshopResponseCompany } from '@/types/workshop';
import { formatDateSearch } from '@/utils/app/format';
import { logOut } from '@/store/slices/user';
import { ITransactionAllResponse, IWalletsResponse } from '@/types/wallets';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithForceLogout = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logOut());
    await persistor.purge();
    window.location.href = '/auth/login';
  }
  return result;
};

export const adminCompanyApi = createApi({
  reducerPath: 'adminCompanyApi',
  baseQuery: baseQueryWithForceLogout,
  tagTypes: ['Workshop', 'Company', 'JobCompany', 'Profile', 'UniversityApply', 'studentsApply', 'Wallet'],
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
        { page: number; size: number; keyword: string; status: string; startDate: Date | null; endDate: Date | null; sortBy: string | null }
      >({
        query: ({ page, size, keyword, status, startDate, endDate, sortBy }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');
          if (sortBy) queryParams.append('sortBy', sortBy);

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
        invalidatesTags: () => [{ type: 'Profile' }],
      }),

      //JOBCOMPANY
      getAllCompanyJob: builder.query<
        IJobAllResponse,
        { page: number; size: number; keyword: string; status: string; startDate: Date | null; endDate: Date | null; sortBy: string | null }
      >({
        query: ({ page, size, keyword, startDate, endDate, status, sortBy }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (sortBy) queryParams.append('sortBy', sortBy);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');

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
          sortBy: string | null;
        }
      >({
        query: ({ page, size, keyword, status, startDate, endDate, sortBy }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (status) queryParams.append('status', status);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');
          if (sortBy) queryParams.append('sortBy', sortBy);
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
          jobId: number;
          status: string;
        }
      >({
        query: ({ page, size, keyword, companyId, status, jobId }) => {
          let queryParams = new URLSearchParams();
          if (companyId) queryParams.append('companyId', String(companyId));
          if (jobId) queryParams.append('jobId', String(jobId));
          if (keyword) queryParams.append('keyword', keyword);
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (status) queryParams.append('status', status);
          return `/company/applies?${queryParams.toString()}`;
        },
        providesTags: ['UniversityApply'],
      }),

      //Get all student apply
      getAllStudentApplyJob: builder.query<
        StudentApplyJobResponse,
        {
          page: number;
          size: number;
          jorId: number;
          universityId: number;
        }
      >({
        query: ({ page, size, jorId, universityId }) => {
          let queryParams = new URLSearchParams();
          if (universityId) queryParams.append('universityId', String(universityId));
          if (jorId) queryParams.append('jorId', String(jorId));
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          return `/company/get-student-apply?${queryParams.toString()}`;
        },
        providesTags: ['studentsApply'],
      }),

      // Approve Student tJob
      approveStudentJob: builder.mutation({
        query: ({ ids }) => ({
          url: `/company/approve-students-apply`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: (result, error, { ids }) => [{ type: 'studentsApply', ids }, { type: 'studentsApply' }],
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

      // Get detail student apply job
      getDetailStudentApplyJob: builder.query<IStudentApplyJobResponse, { id: number }>({
        query: ({ id }) => `/company/student-apply-job-detail?studentId=${id}`,
        providesTags: (result, error, { id }) => [{ type: 'studentsApply', id: id }],
      }),
      //wallet
      //Get all wallet
      getAllWallets: builder.query<IWalletsResponse, { accountId: number }>({
        query: ({ accountId }) => `/account/${accountId}/wallets`,
        providesTags: (result, error, { accountId }) => [{ type: 'Wallet', id: accountId }],
      }),
      //Create Wallet
      CreateWallet: builder.mutation({
        query: ({ idAccount, pinCode }) => ({
          url: `/account/${idAccount}/wallets/create-wallet`,
          method: 'POST',
          body: { pinCode: pinCode },
        }),
        invalidatesTags: (result, error, { idAccount }) => [{ type: 'Wallet', idAccount }, { type: 'Wallet' }],
      }),
      checkWallet: builder.mutation({
        query: ({ idAccount, pinCode }) => ({
          url: `/account/${idAccount}/wallets/check-pin-code`,
          method: 'POST',
          body: { pinCode: pinCode },
        }),
      }),
      //Add money
      addMoney: builder.query({
        query: ({ amount }) => `/payments/vn-pay?amount=${amount}`,
      }),
      //Vnpay-callback
      sendPaymentResult: builder.mutation({
        query: params => ({
          url: `/payments/vn-pay-callback?${new URLSearchParams(params)}`,
          method: 'GET',
        }),
      }),
      //Search transaction
      getAllTransactions: builder.query<ITransactionAllResponse, { accountId: number; page: number; size: number; keyword: string; sortBy?: string | null }>({
        query: ({ accountId, page, size, keyword, sortBy }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (sortBy) queryParams.append('sortBy', sortBy);

          return `/wallet/${accountId}/payment-transactions?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'JobCompany' }],
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
  useGetAllStudentApplyJobQuery,
  useApproveStudentJobMutation,
  useGetDetailStudentApplyJobQuery,
  useGetAllWalletsQuery,
  useLazyAddMoneyQuery,
  useCreateWalletMutation,
  useCheckWalletMutation,
  useSendPaymentResultMutation,
  useGetAllTransactionsQuery,
} = adminCompanyApi;
