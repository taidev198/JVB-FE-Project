import { adminCompanyApi } from '@/services/adminCompanyApi';
import { IFields } from '.';
import { IAddress } from './addressesTypes';

export interface IProfileCompany {
  id: number;
  linkWebsite: string;
  email: string;
  companyName: string;
  companyCode: string;
  logoUrl: string;
  companyDescription: string;
  companyShortDescription: string;
  phoneNumber: string;
  taxCode: string;
  establishedDate: string;
  fields: IFields[];
  address: IAddress;
  quantityEmployee: number;
  account: {
    id: number;
    email: string;
    statusAccount: string;
  };
}

export interface IProfileCompanyRespone {
  code: number;
  message: string;
  data: IProfileCompany;
}
