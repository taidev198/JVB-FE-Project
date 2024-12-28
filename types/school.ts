import { IAddress } from './addressesTypes';
import { IAccount } from '.';

export interface ISchool {
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
  address: IAddress;
  universityType: string;
  account: IAccount;
}

export interface ApiResponseSchool {
  code: number;
  message: string;

  data: {
    content: ISchool[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ApiResponseDetailSchool {
  code: number;
  message: string;

  data: ISchool;
}
