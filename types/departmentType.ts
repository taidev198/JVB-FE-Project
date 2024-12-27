import { University } from '.';

export interface IDepartment {
  id: number;
  facultyCode: string;
  facultyName: string;
  establishYear: number;
  nameDean: string;
  address: string;
  facultyDescription: string;
  university: University;
  isDelete: boolean;
  account: { id: number; email: string; createAt: string; updateAt: string; statusAccount: string };
}

export interface ApiResponse {
  code: number;
  message: string;
  data: {
    content: IDepartment[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ApiResponseDetail {
  code: number;
  message: string;
  data: IDepartment;
}

export interface DepartmentResponsePortal {
  code: number;
  message: string;
  data: IDepartment[];
}

export interface DepartmentResponse {
  code: number;
  message: string;
  data: IDepartment[];
}
