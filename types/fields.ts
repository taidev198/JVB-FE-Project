export interface IFields {
  id: number;
  fieldName: string;
}

export interface FieldsResponse {
  code: 200;
  message: 'Thành công!';
  data: IFields[];
}
