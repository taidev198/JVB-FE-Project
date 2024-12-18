/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';
import { ApiResponse, ApiResponseDetail, DepartmentResponsePortal } from '@/types/departmentType';
import { WorkshopDetailResponse, WorkshopResponse } from '@/types/workshop';
import { FieldsResponse } from '@/types/fields';
import { formatDateSearch } from '@/utils/app/format';
import { ApiResponseBusiness, ApiResponseDetailBusiness } from '@/types/businesTypes';
import UpdateBusiness from '@/pages/admin/school/businessManagement/update/[id]';
import { MajorResponse } from '@/types/majorType';
import { ApiResponseAcademicOfficeManagement, ApiResponseDetailAdemicOfficeManagement } from '@/types/academicOfficeManagementType';
import { StudentDetailResponse, StudentResponse } from '@/types/studentType';
import { IMajorByUniversityResponse } from '@/types/majorType';
import { ApiResponseDetailSchool, ApiResponseSchool } from '@/types/school';

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
  tagTypes: ['Workshop', 'Department', 'Student', 'Business', 'AcademicOfficeManagement', 'School', 'CurrentSchool'],
  endpoints: builder => {
    return {
      getAllDepartments: builder.query<ApiResponse, { page: number; size: number; keyword: string }>({
        query: ({ page, size, keyword }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);

          return `/university/faculties?${queryParams.toString()}`;
        },
        providesTags: result => (result ? [{ type: 'Department', id: 'list' }] : []),
      }),

      getAllDepartmentsPortal: builder.query<DepartmentResponsePortal, void>({
        query: () => ({
          url: '/portal/faculties/get-all',
        }),
        providesTags: [{ type: 'Department' }],
      }),

      detailDepartments: builder.query<ApiResponseDetail, { id: number | null }>({
        query: ({ id }) => ({
          url: `/university/faculties/${id}`,
        }),
        providesTags: result => (result ? [{ type: 'Department', id: result.data.id }] : [{ type: 'Department' }]),
      }),

      getAllFields: builder.query<FieldsResponse, void>({
        query: () => ({
          url: '/fields',
        }),
      }),
      getAllMajorBy: builder.query<MajorResponse, void>({
        query: () => ({
          url: '/university/faculties/get-all',
        }),
        providesTags: [{ type: 'Department' }],
      }),

      AddDepartment: builder.mutation({
        query: formData => ({
          url: '/university/faculties/add',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Department', id: 'list' }],
      }),
      UpdateDepartment: builder.mutation<any, { formData: FormData; id: number }>({
        query: ({ formData, id }) => ({
          url: `/university/faculties/update/${id}`,
          method: 'PUT',
          body: formData,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, { type: 'Department' }],
      }),
      deleteDepartmentOne: builder.mutation({
        query: ({ id }) => ({
          url: `/university/faculties/delete/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, { type: 'Department' }],
      }),

      deleteDepartmentMultiple: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/university/faculties/delete-multiple`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: (result, error, { ids }) => [{ type: 'Department', ids }, { type: 'Department', ids }, { type: 'Department' }, { type: 'Department' }],
      }),

      //business
      getAllBusiness: builder.query<ApiResponseBusiness, { page: number; size: number; keyword: string }>({
        query: ({ page, size, keyword }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);

          return `/university/majors?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'Business', id: 'listBu' }],
      }),
      getDetailBusiness: builder.query<ApiResponseDetailBusiness, { id: number | null }>({
        query: ({ id }) => ({
          url: `/university/majors/${id}`,
        }),
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Business', id }] : []),
      }),
      addBusiness: builder.mutation({
        query: formData => ({
          url: '/university/majors/add',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Business', id: 'listBu' }],
      }),
      UpdateBusiness: builder.mutation({
        query: (args: { formData: FormData; id: number | null }) => ({
          url: `/university/majors/update/${args.id}`,
          method: 'PUT',
          body: args.formData,
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Business', id },
                { type: 'Business', id: 'listBu' },
              ]
            : [{ type: 'Business', id: 'listBu' }];
        },
      }),

      deleteBusinessOne: builder.mutation<any, { id: number }>({
        query: ({ id }) => ({
          url: `/university/majors/delete/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, { type: 'Business' }],
      }),
      deleteBusinessMultiple: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/university/majors/delete-multiple`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: () => [{ type: 'Business' }],
      }),
      //academicOfficeManagement
      getAllAcademicOfficeManagement: builder.query<ApiResponseAcademicOfficeManagement, { page: number; size: number; keyword: string }>({
        query: ({ page, size, keyword }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);

          return `/university/university-employees?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'AcademicOfficeManagement', id: 'listAc' }],
      }),
      getDetailAcademicOfficeManagement: builder.query<ApiResponseDetailAdemicOfficeManagement, { id: number | null }>({
        query: ({ id }) => ({
          url: `/university/university-employees/${id}`,
        }),
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'AcademicOfficeManagement', id }] : []),
      }),

      addAcademicOfficeManagement: builder.mutation({
        query: formData => ({
          url: '/university/university-employees/add',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'AcademicOfficeManagement' }],
      }),
      // Majors
      getAllMajors: builder.query<IMajorByUniversityResponse, void>({
        query: () => {
          return 'university/majors/get-all';
        },
      }),
      deleteAdemicOne: builder.mutation({
        query: ({ id }) => ({
          url: `/university/university-employees/delete/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'AcademicOfficeManagement', id }, { type: 'AcademicOfficeManagement' }],
      }),

      deleteAdemicMultiple: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/university/university-employees/delete-multiple`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: () => [{ type: 'AcademicOfficeManagement' }],
      }),
      updateAdemic: builder.mutation({
        query: (args: { formData: FormData; id: number | null }) => ({
          url: `/university/university-employees/update/${args.id}`,
          method: 'PUT',
          body: args.formData,
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'AcademicOfficeManagement', id },
                { type: 'AcademicOfficeManagement', id: 'listAc' },
              ]
            : [{ type: 'AcademicOfficeManagement', id: 'listAc' }];
        },
      }),
      getDetailAdemic: builder.query<ApiResponseDetailAdemicOfficeManagement, { id: number | null }>({
        query: ({ id }) => {
          return {
            url: `university/university-employee/${id}`,
          };
        },
      }),
      //school

      getDetailSchool: builder.query<ApiResponseDetailSchool, void>({
        query: () => {
          return {
            url: `/university/detail-current`,
          };
        },
        providesTags: ['CurrentSchool'],
      }),
      UpdateSchool: builder.mutation({
        query: (args: { formData: FormData }) => ({
          url: `/university/update`,
          method: 'PUT',
          body: args.formData,
        }),
        invalidatesTags: ['CurrentSchool'],
      }),
      // Workshop
      getAllWorShopsUniversity: builder.query<
        WorkshopResponse,
        { page: number | null; size: number | null; keyword: string; startDate: Date | null; endDate: Date | null }
      >({
        query: ({ page, size, keyword, startDate, endDate }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (startDate) queryParams.append('startDate', formatDateSearch(startDate) || '');
          if (endDate) queryParams.append('endDate', formatDateSearch(endDate) || '');
          return `/university/workshops?${queryParams.toString()}`;
        },
        providesTags: [{ type: 'Workshop', id: 'LIST' }],
      }),

      getDetailWorkshop: builder.query<WorkshopDetailResponse, { id: number | null }>({
        query: ({ id }) => ({
          url: `/workshops/${id}`,
        }),
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Workshop', id }] : []),
      }),

      addWorkshop: builder.mutation({
        query: formData => ({
          url: '/university/workshops/create',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Workshop', id: 'LIST' }],
      }),

      updateWorkshop: builder.mutation({
        query: (args: { formData: FormData; id: number | null }) => ({
          url: `/university/workshops/update/${args.id}`,
          method: 'PUT',
          body: args.formData,
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

      deleteWorkshop: builder.mutation({
        query: (args: { id: number | null }) => ({
          url: `/workshops/delete/${args.id}`,
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

      // Students
      getAllStudents: builder.query<
        StudentResponse,
        {
          page: number | null;
          size: number | null;
          keyword: string | null;
          majorId: number | null;
          facultyId: number | null;
        }
      >({
        query: ({ page, size, keyword, majorId, facultyId }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (majorId) queryParams.append('majorId', String(majorId));
          if (facultyId) queryParams.append('facultyId', String(facultyId));

          return `/university/students?${queryParams.toString()}`;
        },
        providesTags: ['Student'],
      }),

      getDetailStudent: builder.query<StudentDetailResponse, { id: number | null }>({
        query: ({ id }) => {
          return {
            url: `university/students/${id}`,
          };
        },
        providesTags: (result, error, { id }) => (id !== null ? [{ type: 'Student', id }] : []),
      }),

      addStudent: builder.mutation({
        query: formData => ({
          url: '/university/students/add',
          method: 'POST',
          body: formData,
        }),
      }),

      updateStudent: builder.mutation({
        query: ({ formData, id }) => ({
          url: `/university/students/update/${id}`,
          method: 'PUT',
          body: formData,
        }),
        invalidatesTags: result => [{ type: 'Student', id: result.data.id }, { type: 'Student' }],
      }),

      deleteStudentOne: builder.mutation({
        query: ({ id }) => ({
          url: `/university/students/delete/${id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, { type: 'Student' }],
      }),

      deleteStudentMultiple: builder.mutation<any, { ids: number[] }>({
        query: ({ ids }) => ({
          url: `/university/students/delete-multiple`,
          method: 'PUT',
          body: { ids },
        }),
        invalidatesTags: () => [{ type: 'Student' }],
      }),
    };
  },
});

export const {
  useGetAllDepartmentsQuery,
  useGetAllDepartmentsPortalQuery,
  useDetailDepartmentsQuery,
  useGetAllMajorsQuery,
  useGetAllWorShopsUniversityQuery,
  useGetAllFieldsQuery,
  useGetDetailWorkshopQuery,
  useAddWorkshopMutation,
  useUpdateWorkshopMutation,
  useDeleteWorkshopMutation,
  useDeleteDepartmentMultipleMutation,
  useDeleteDepartmentOneMutation,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetAllStudentsQuery,
  useGetAllBusinessQuery, 
  useUpdateBusinessMutation,
  useGetDetailBusinessQuery,
  useDeleteBusinessMultipleMutation,
  useDeleteBusinessOneMutation,
  useGetAllMajorByQuery,
  useAddBusinessMutation,
  useGetAllAcademicOfficeManagementQuery,
  useGetDetailAcademicOfficeManagementQuery,
  useGetDetailAdemicQuery,
  useUpdateAdemicMutation,
  useGetDetailStudentQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentOneMutation,
  useDeleteStudentMultipleMutation,
  useAddAcademicOfficeManagementMutation,
  useDeleteAdemicMultipleMutation,
  useDeleteAdemicOneMutation,
  useGetDetailSchoolQuery,
  useUpdateSchoolMutation,
} = adminSchoolApi;
