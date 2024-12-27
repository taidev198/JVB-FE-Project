import { IFaculty } from './facultyType';

export interface IMajor {
  id: number;
  majorName: string;
  majorCode: string;
  creditRequirement: number;
  majorDescription: string;
  numberOfStudents: number;
  faculty: IFaculty;
}

export interface IMajores {
  id: number;
  facultyName: string;
}

export interface MajorResponse {
  code: 200;
  message: 'Thành công!';
  data: IMajores[];
}

export interface IMajorByUniversityResponse {
  code: number;
  message: string;
  data: {
    id: number;
    majorName: string;
  }[];
}
