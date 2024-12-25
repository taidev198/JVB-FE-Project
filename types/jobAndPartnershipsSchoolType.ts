import { IBusiness } from './businesTypes';
import { ICompany } from './companyType';
import { IJobCompany } from './jobCompany';
import { IUniversity } from './university';

export interface IJobsSchool {
  job: IJobCompany;
  major: IBusiness;
  status: string;
}

export interface IJobCompanyResponse {
  code: number;
  message: string;
  data: {
    content: IJobsSchool[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IPartnershipsSchool {
  company: ICompany;
  startDate: string;
  partnershipStatus: string;
}

export interface IPartnershipsSchoolResponse {
  code: 200;
  message: 'Thành công!';
  data: {
    content: IPartnershipsSchool[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface IPartnershipsUniversity {
  university: IUniversity;
  startDate: string;
  partnershipStatus: string;
}

export interface IPartnershipsUniversityResponse {
  code: 200;
  message: 'Thành công!';
  data: {
    content: IPartnershipsUniversity[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}
