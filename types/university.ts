import { IAddress } from './addressesTypes';
import { IAccount, IFields } from '.';

export interface IUniversity {
  id: number;
  universityName: string;
  email: string;
  logoUrl: string;
  universityCode: string;
  linkWebsite: string;
  universityDescription: string;
  universityShortDescription: string;
  phoneNumber: string;
  establishedDate: string;
  universityType: string;
  address: IAddress;
  account: IAccount;
  fields: IFields[];
  numberOfStudents: number;
  numberOfGraduates: number;
}

export interface UniversityResponse {
  code: number;
  message: string;
  data: {
    content: IUniversity[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface UniversityDetailResponse {
  code: number;
  message: string;
  data: IUniversity;
}
