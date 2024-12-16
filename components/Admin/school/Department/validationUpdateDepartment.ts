import * as Yup from 'yup';

const validationSchemaUpdateDepartment = Yup.object({
  facultyName: Yup.string().required('Tên khoa là bắt buộc').max(50, 'Tên khoa không được quá 50 kí tự'),
  facultyCode: Yup.string().required('Mã khoa là bắt buộc').max(50, 'Mã khoa không được quá 50 kí tự'),
  establishYear: Yup.number()
    .nullable()
    .typeError('Giá trị phải là một số')
    .min(1900, 'Năm thành lập không được trước 1900')
    .max(new Date().getFullYear(), 'Năm thành lập không được vượt quá năm hiện tại')
    .required('Năm thành lập là bắt buộc'),
  facultyDescription: Yup.string(),
  nameDean: Yup.string().required('Tên trưởng khoa là bắt buộc').max(50, 'Tên trưởng khoa không được quá 50 kí tự'),
  address: Yup.string().required('Địa chỉ là bắt buộc').max(150, 'Địa chỉ không được quá 150 kí tự'),
});

export default validationSchemaUpdateDepartment;
