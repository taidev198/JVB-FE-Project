import { IUniversity } from './university';

export interface IFaculty {
  id: number;
  facultyCode: string;
  facultyName: string;
  establishYear: number;
  nameDean: string;
  address: number;
  facultyDescription: string;
  university: IUniversity;
  isDelete: true;
}
