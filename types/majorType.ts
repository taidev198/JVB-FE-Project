import { IFaculty } from './facultyType';

export interface IMajor {
  id: 10;
  majorName: string;
  majorCode: string;
  creditRequirement: number;
  majorDescription: string;
  numberOfStudents: number;
  faculty: IFaculty;
}
