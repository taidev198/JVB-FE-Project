// types/companyType.ts

import { IAddress } from './addressesTypes';
import { IAccount, IFields } from '.';

export interface ICompany {
  id: number;
  linkWebsite: string;
  companyName: string;
  companyCode: string;
  logoUrl: string;
  companyDescription: string;
  companyShortDescription: string;
  phoneNumber: string;
  taxCode: string;
  quantityEmployee: number;
  establishedDate: string;
  fields: IFields[];
  address: IAddress;
  account: IAccount;
  createAt: string;
  updateAt: string;
  email: string;
  districtId: number;
  provinceId: number;
  isPartnership: boolean | null;
}

export interface ICompanyEmploy {
  id: number;
  employeeCode: string;
  account: {
    id: number;
    email: string;
  };
  avatarUrl: string;
  phoneNumber: string;
  fullName: string;
  address: IAddress;
  employeePosition: string;
  dateOfBirth: string;
  employeeStatus: string;
  gender: string;
  salary: number;

  company: {
    id: number;
    companyCode: string;
    companyName: string;
  };
  isDelete: false;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ICompanyAllResponse {
  code: number;
  message: string;
  data: {
    content: ICompanyEmploy[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ICompanyDetailResponse {
  code: number;
  message: string;
  data: ICompanyEmploy;
}

export interface IAccountCompanyAllResponse {
  code: number;
  message: string;
  data: {
    content: ICompany[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IAccountCompanyDetailResponse {
  code: number;
  message: string;
  data: ICompany;
}
