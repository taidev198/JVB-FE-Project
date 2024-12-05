import { Address } from './addressesTypes';
import { Fields } from '.';

export interface ICompany {
  token: string;
  user: {
    id: number;
    linkWebsite: string;
    email: string;
    companyName: string;
    companyCode: string;
    logoUrl: string;
    companyDescription: string;
    phoneNumber: string;
    taxCode: string;
    establishedDate: string;
    fields: Fields[];
    addresses: Address;
  };
  roleAccount: string;
}

export interface ISchool {
  token: string;
  user: {
    id: number;
    universityName: string;
    email: string;
    logoUrl: string | null;
    universityCode: string;
    linkWebsite: string | null;
    universityDescription: string;
    phoneNumber: string;
    establishedDate: string;
    universityType: string;
    addresses: Address;
  };
  numberOfStudents: number;
  numberOfGraduates: number;
  roleAccount: string;
}

export interface IAdmin {
  token: string;
  user: {
    id: number;
    fullName: string;
    dateOfBirth: string | null;
    gender: string;
    phoneNumber: number;
    email: string;
  };
  roleAccount: string;
}

export interface IEmploymentSchool {
  token: string;
  user: {
    id: 1;
    employeeCode: string;
    phoneNumber: string;
    fullName: string;
    avatarUrl: string;
    address: Address;
  };
  gender: string;
  dateOfBirth: string;
  universityId: number | null;
  isDelete: boolean;
  roleAccount: string;
}

export interface IEmploymentCompany {
  token: string;
  user: {
    id: number;
    employeeCode: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    address: Address | null;
    employeePosition: string;
    dateOfBirth: string;
    gender: string;
    salary: number;
    isDelete: boolean;
  };
  roleAccount: string;
}
