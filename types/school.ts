import { IAccount } from '.';
import { IAddress } from './addressesTypes';

export interface ISchool {
  id: number;
  universityName: string;
  email: null;
  logoUrl: null;
  universityCode: string;
  linkWebsite: null;
  universityDescription: string;
  universityShortDescription: null;
  phoneNumber: string;
  establishedDate: string;
  address: IAddress;
  universityType: string;
  account: IAccount;
  numberOfStudents: number;
  numberOfGraduates: number;
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
