import { IAddress } from './addressesTypes';
import { IFields } from '.';

export interface ICompany {
  id: number;
  linkWebsite: string;
  companyName: string;
  companyCode: string;
  logoUrl: string;
  companyDescription: string;
  phoneNumber: string;
  taxCode: string;
  establishedDate: string;
  fields: IFields[];
  address: IAddress;
  account: { id: number; email: string; createAt: string; updateAt: string; statusAccount: string };
  createAt: string;
  updateAt: string;
}

export interface ICompanyAllResponse {
  code: number;
  message: string;
  data: {
    content: {
      id: number;
      companyName: string;
      companyCode: string;
      account: {
        id: number;
        email: string;
        statusAccount: string;
      };
      createAt: string;
      updateAt: string;
    }[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ICompanyDetailResponse {
  code: number;
  message: string;
  data: ICompany;
}
