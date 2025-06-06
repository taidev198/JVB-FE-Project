import * as Yup from 'yup';

const validationSchemaUpdateDepartment = Yup.object({
  facultyName: Yup.string().required('Tên khoa là bắt buộc').max(50, 'Tên khoa không được quá 50 kí tự'),
  facultyCode: Yup.string().required('Mã khoa là bắt buộc').max(50, 'Mã khoa không được quá 50 kí tự'),
  establishYear: Yup.number()
    .required('Năm thành lập là bắt buộc')
    .typeError('Năm thành lập phải là một số hợp lệ')
    .test('valid-year-format', 'Năm thành lập phải bao gồm đúng 4 chữ số', value => {
      return value && /^\d{4}$/.test(value.toString());
    })
    .test('valid-year', 'Năm thành lập không được vượt quá năm hiện tại', value => {
      const currentYear = new Date().getFullYear();
      return value && value <= currentYear;
    }),

  nameDean: Yup.string().required('Tên trưởng khoa là bắt buộc').max(50, 'Tên trưởng khoa không được quá 50 kí tự'),
  address: Yup.string().required('Địa chỉ khoa cụ thể là bắt buộc').max(150, 'Địa chỉ không được quá 150 kí tự'),
});

export default validationSchemaUpdateDepartment;
