export interface IFields {
  id: number;
  fieldName: string;
}

export interface University {
  id: number;
  universityCode: string;
  universityName: string;
}
export interface Faculty {
  id: number;
  facultyCode: string;
  facultyName: string;
  establishYear: number;
  nameDean: string;
  address: string;
  facultyDescription: string;
}

export interface IAccount {
  id: number;
  email: string;
  statusAccount: string;
}
