import { Address } from 'cluster';

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
  address: Address;
  numberOfStudents: number;
  numberOfGraduates: number;
}
