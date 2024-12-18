import { IAccount } from '.';
import { IAddress } from './addressesTypes';

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
  establishedDate: string | null;
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
