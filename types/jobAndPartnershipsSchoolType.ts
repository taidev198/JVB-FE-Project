import { IBusiness } from './businesTypes';
import { ICompany } from './companyType';
import { IJobCompany } from './jobCompany';

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
