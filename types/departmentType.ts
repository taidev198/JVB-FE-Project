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
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
