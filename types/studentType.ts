import { IAddress } from './addressesTypes';
import { IMajor } from './majorType';

export interface IStudent {
  id: number;
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  gender: string;
  phoneNumber: string;
  yearOfEnrollment: number;
  address: IAddress;
  major: IMajor;
  gpa: number;
  dateOfBirth: string;
  studentStatus: number;
}

export interface StudentResponse {
  code: number;
  message: string;
  data: {
    content: IStudent[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}
