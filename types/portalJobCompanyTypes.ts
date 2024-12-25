import { ICompany } from './companyType';

export interface IJobByCompany {
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
