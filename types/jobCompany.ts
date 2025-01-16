// types/jobCompany.ts

import { IMajor } from './majorType';
import { ICompany } from './companyType';
import { IUniversity } from './university';
import { IStudent } from './studentType';
import { IFields } from '.';

export interface IJobCompany {
  id: number;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  jobType: string;
  workTime: string;
  statusUnviersityApply?: string | null;
  benifits: string;
  jobLevel: string;
  expirationDate: string;
  memberOfCandidate: number;
  fields: IFields[];
  company: ICompany;
  createAt: string;
  status: string;
  salaryType: string;
  maxSalary: number;
  minSalary: number;
}

interface IJobCompanyPortal {
  id: number;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  jobType: string;
  workTime: string;
  benifits: string;
  jobLevel: string;
  expirationDate: string;
  memberOfCandidate: number;
  company: ICompany;
  fields: IFields[];
  createAt: string;
  status: string;
  salaryType: string;
  maxSalary: number;
  minSalary: number;
}

export interface IJobAllResponse {
  code: number;
  message: string;
  data: {
    content: IJobCompany[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IJobAllResponsePortal {
  code: number;
  message: string;
  data: {
    content: IJobCompanyPortal[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IJobDetailResponse {
  code: number;
  message: string;
  data: IJobCompany;
}

export interface IJobAllResponseAdminSystem {
  code: number;
  message: string;
  data: {
    content: IJobCompany[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IJobByCompany {
  length: number;
  id: number;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  jobLevel: string;
  minSalary: number | null;
  maxSalary: number | null;
  salaryType: string;
  createAt: string;
  company: ICompany;
}

export interface IJobsData {
  data: {
    content: IJobByCompany[];
  };
}

export interface IJobUniversityApply {
  code: number;
  message: string;
  data: {
    content: {
      university: IUniversity;
      job: IJobCompany;
      isPartnership: boolean;
      status: string;
      major: IMajor;
    }[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface StudentApplyJobResponse {
  code: number;
  message: string;
  data: {
    content: {
      id: number;
      student: IStudent;
      status: string;
    }[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IStudentApplyJobResponse {
  code: number;
  message: string;
  data: IStudent;
}
