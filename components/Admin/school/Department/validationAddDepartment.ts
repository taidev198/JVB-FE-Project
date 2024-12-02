import * as Yup from 'yup';

const validationSchemaAddDepartment = Yup.object({
  facultyName: Yup.string().required('Tên khoa là bắt buộc').max(50, 'Tên khoa không được quá 50 kí tự'),
  facultyCode: Yup.string().required('Mã khoa là bắt buộc').max(50, 'Mã khoa không được quá 50 kí tự'),
  establishYear: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Ngày thành lập là bắt buộc'),
  facultyDescription: Yup.string(),
  nameDean: Yup.string().required('Tên trưởng khoa là bắt buộc').max(50, 'Tên trưởng khoa không được quá 50 kí tự'),
  address: Yup.string().required('Địa chỉ là bắt buộc').max(150, 'Địa chỉ không được quá 150 kí tự'),
});

export default validationSchemaAddDepartment;
