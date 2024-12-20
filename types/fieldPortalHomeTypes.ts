export interface IFieldsPortal {
  fieldName: string;
  countJob: number;
}

export interface FieldsResponsePortal {
  code: 200;
  message: 'Thành công!';
  data: IFieldsPortal[];
}
