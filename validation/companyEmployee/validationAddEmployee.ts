import * as Yup from 'yup';

const validationSchemaAddStudent = Yup.object({
  fullName: Yup.string().required('Tên nhân viên là bắt buộc').max(100, 'Tên nhân viên không được quá 100 kí tự'),
  employeeCode: Yup.string().required('Mã nhân viên là bắt buộc').max(50, 'Mã sinh viên không được quá 50 kí tự'),

  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính phải là Nam, Nữ hoặc Khác').required('Giới tính là bắt buộc'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(50, 'Email không được quá 50 kí tự'),
  employeeStatus: Yup.string().required('Trạng thái học tập là bắt buộc'),
  phoneNumber: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số'),
  employeePosition: Yup.string().required('Chức vụ không được để trống').max(100, 'Chức vụ không được quá 100 kí tự'),
  dateOfBirth: Yup.date()
    .required('Ngày sinh không được để trống')
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') return null;
      return value;
    })
    .test('is-not-null', 'Ngày sinh thể là rỗng', value => value !== null),

  salary: Yup.number()
    .nullable()
    .positive('Lương phải là một số dương')
    .max(100000000, 'Lương không được vượt quá 100 triệu')
    .optional()
    .transform((value, originalValue) => {
      if (originalValue === '') return null;
      return value;
    })
    .test('is-not-null', 'Mức lương không thể là rỗng', value => value !== null),

  account: Yup.string().required('Mật khẩu không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(20, 'Mật khẩu không được quá 20 ký tự'),

  confirmPassword: Yup.string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf([Yup.ref('account')], 'Mật khẩu xác nhận không khớp với mật khẩu'),

  houseNumber: Yup.string().required('Địa chỉ là bắt buộc').max(150, 'Địa chỉ không được quá 150 kí tự'),
  districtName: Yup.string().required('Quận là bắt buộc').max(150, 'Quận không được quá 150 kí tự'),
  wardName: Yup.string().required('Phường là bắt buộc').max(150, 'Phường không được quá 150 kí tự'),
  provinceName: Yup.string().required('Thành phố là bắt buộc').max(150, 'Thành phố không được quá 150 kí tự'),
});

export default validationSchemaAddStudent;
