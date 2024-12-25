import { IAddress } from './addressesTypes';
import { IAccount } from '.';

export interface ICompany {
  code: number;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      fullName: string;
      linkWebsite: string;
      email: string;
      companyName: string;
      companyCode: string;
      logoUrl: string;
      companyDescription: string;
      phoneNumber: string;
      taxCode: string;
      establishedDate: string;
      account: IAccount;
      addresses: IAddress;
    };
    roleAccount: string;
  };
}

export interface ISchool {
  code: number;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      fullName: string;
      universityName: string;
      email: string;
      logoUrl: string | null;
      universityCode: string;
      linkWebsite: string | null;
      universityDescription: string;
      phoneNumber: string;
      account: IAccount;
      establishedDate: string;
      universityType: string;
      addresses: IAddress;
    };
    numberOfStudents: number;
    numberOfGraduates: number;
    roleAccount: string;
  };
}

export interface IAdmin {
  code: number;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      fullName: string;
      dateOfBirth: string | null;
      gender: string;
      account: IAccount;
      phoneNumber: number;
      email: string;
    };
    roleAccount: string;
  };
}

export interface IEmploymentSchool {
  code: number;
  message: string;
  data: {
    token: string;
    user: {
      id: 1;
      employeeCode: string;
      phoneNumber: string;
      fullName: string;
      avatarUrl: string;
      account: IAccount;
      address: IAddress;
    };
    gender: string;
    dateOfBirth: string;
    universityId: number | null;
    isDelete: boolean;
    roleAccount: string;
  };
}

export interface IEmploymentCompany {
  code: number;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      employeeCode: string;
      email: string;
      phoneNumber: string;
      fullName: string;
      address: IAddress | null;
      employeePosition: string;
      dateOfBirth: string;
      gender: string;
      account: IAccount;
      salary: number;
      isDelete: boolean;
    };
    roleAccount: string;
  };
}
