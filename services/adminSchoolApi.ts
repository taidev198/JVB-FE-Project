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
  tagTypes: ['Workshop', 'Department', 'Student', 'Business', 'AcademicOfficeManagement'],
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
        providesTags: result =>
          result
            ? [
                { type: 'Department', id: 'list' }, // Liên kết tag này với getAllDepartments
              ]
            : [],
      }),

      getAllDepartmentsPortal: builder.query<DepartmentResponsePortal, void>({
        query: () => ({
          url: '/portal/faculties/get-all',
        }),
      }),

      detailDepartments: builder.query<ApiResponseDetail, { id: number | null }>({
        query: ({ id }) => ({
          url: `/university/faculties/${id}`,
        }),
        providesTags: result => (result ? [{ type: 'Department', id: result.data.id }] : [{ type: 'Department' }]),
      }),

      // UpdateDepartment: builder.mutation({
      //   query: (args: { formData: FormData; id: number | null }) => ({
      //     url: `/university/faculties/update/${args.id}`,
      //     method: 'PUT',
      //     body: args.formData,
      //   }),
      //   // Invalidates the cache for 'Department' list to trigger a refetch of the data
      //   invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, { type: 'Department' }],
      // }),

      deleteDepartment: builder.mutation({
        query: (args: { id: number | null }) => ({
          url: `/university/faculties/delete/${args.id}`,
          method: 'PUT',
        }),
        invalidatesTags: [{ type: 'Department', id: 'list' }], // Chỉ invalidates tag danh sách, đảm bảo gọi lại getAllDepartments
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
      }),

      AddDepartment: builder.mutation({
        query: formData => ({
          url: '/university/faculties/add',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Department', id: 'list' }],
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
              ] // Invalidates cả tag của workshop cụ thể và danh sách
            : [{ type: 'Business', id: 'listBu' }]; // Nếu không có id, chỉ invalidates danh sách
        },
      }),
      UpdateDepartment: builder.mutation({
        query: (args: { formData: FormData; id: number | null }) => ({
          url: `/university/faculties/update/${args.id}`,
          method: 'PUT',
          body: args.formData,
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Business', id },
                { type: 'Business', id: 'listBu' },
              ] // Invalidates cả tag của workshop cụ thể và danh sách
            : [{ type: 'Business', id: 'listBu' }]; // Nếu không có id, chỉ invalidates danh sách
        },
      }),
      deleteBusiness: builder.mutation({
        query: (args: { id: number | null }) => ({
          url: `/university/majors/delete/${args.id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'Business', id },
                { type: 'Business', id: 'listBu' },
              ] // Invalidates cả tag của workshop cụ thể và danh sách
            : [{ type: 'Business', id: 'listBu' }]; // Nếu không có id, chỉ invalidates danh sách
        },
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
      deleteAcademicOfficeManagement: builder.mutation({
        query: (args: { id: number | null }) => ({
          url: `/university/university-employees/delete/${args.id}`,
          method: 'PUT',
        }),
        invalidatesTags: (result, error, { id }) => {
          return id !== null
            ? [
                { type: 'AcademicOfficeManagement', id },
                { type: 'AcademicOfficeManagement', id: 'listAc' },
              ] // Invalidates cả tag của AcademicOfficeManagement cụ thể và danh sách
            : [{ type: 'AcademicOfficeManagement', id: 'listAc' }]; // Nếu không có id, chỉ invalidates danh sách
        },
      }),

      // Majors
      getAllMajors: builder.query<IMajorByUniversityResponse, void>({
        query: () => {
          return 'university/majors/get-all';
        },
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
              ] // Invalidates cả tag của workshop cụ thể và danh sách
            : [{ type: 'Workshop', id: 'LIST' }]; // Nếu không có id, chỉ invalidates danh sách
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
              ] // Invalidates cả tag của workshop cụ thể và danh sách
            : [{ type: 'Workshop', id: 'LIST' }]; // Nếu không có id, chỉ invalidates danh sách
        },
      }),

      // Students
      getAllStudents: builder.query<
        StudentResponse,
        {
          page: number | null | undefined;
          size: number | null | undefined;
          keyword: string | null | undefined;
          majorId: number | null | undefined;
          facultyId: number | null | undefined;
        }
      >({
        query: ({ page, size, keyword, majorId, facultyId }) => {
          let queryParams = new URLSearchParams();
          if (page) queryParams.append('page', String(page));
          if (size) queryParams.append('size', String(size));
          if (keyword) queryParams.append('keyword', keyword);
          if (keyword) queryParams.append('majorId', String(majorId));
          if (keyword) queryParams.append('facultyId', String(facultyId));

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
      }),

      addStudent: builder.mutation({
        query: formData => ({
          url: '/university/students/add',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: ['Student'],
      }),

      deleteStudentOne: builder.mutation({
        query: ({ id }) => ({
          url: `university/student/delete/${id}`,
          method: 'DELETE',
        }),
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
  useDeleteDepartmentMutation,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetAllStudentsQuery,
  useGetAllBusinessQuery,
  useUpdateBusinessMutation,
  useGetDetailBusinessQuery,
  useDeleteBusinessMutation,
  useGetAllMajorByQuery,
  useLazyDetailDepartmentsQuery,
  useAddBusinessMutation,
  useGetAllAcademicOfficeManagementQuery,
  useGetDetailAcademicOfficeManagementQuery,
  useDeleteAcademicOfficeManagementMutation,
  useGetDetailStudentQuery,
  useAddStudentMutation,
  useDeleteStudentOneMutation,
} = adminSchoolApi;
