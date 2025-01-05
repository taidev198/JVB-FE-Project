import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

const validationUpdateEmployy = Yup.object({
  fullName: Yup.string().required('Tên nhân viên là bắt buộc').max(100, 'Tên nhân viên không được quá 100 kí tự'),
  employeeCode: Yup.string().required('Mã nhân viên là bắt buộc').max(50, 'Mã sinh viên không được quá 50 kí tự'),

  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính phải là Nam, Nữ hoặc Khác').required('Giới tính là bắt buộc'),
  email: Yup.string()
    .required('Email là bắt buộc')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .max(50, 'Email không được quá 50 kí tự'),
  phoneNumber: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số'),
  employeePosition: Yup.string().required('Chức vụ là bắt buộc').max(100, 'Chức vụ không được quá 100 kí tự'),
  dateOfBirth: Yup.mixed<Dayjs>()
    .test('is-dayjs', 'Invalid date', value => dayjs.isDayjs(value))
    .required('Ngày hết hạn là bắt buộc'),

  salary: Yup.number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Lương là bắt buộc')
    .positive('Lương phải là số dương'),

  houseNumber: Yup.string().required('Địa chỉ cụ thể là bắt buộc').max(150, 'Địa chỉ cụ thể không được quá 150 kí tự'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
});

export default validationUpdateEmployy;
