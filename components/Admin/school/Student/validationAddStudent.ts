import * as Yup from 'yup';

const validationSchemaAddStudent = Yup.object({
  fullName: Yup.string().required('Tên sinh viên là bắt buộc').max(100, 'Tên sinh viên không được quá 100 kí tự'),
  studentCode: Yup.string().required('Mã sinh viên là bắt buộc').max(50, 'Mã sinh viên không được quá 50 kí tự'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(50, 'Email không được quá 50 kí tự'),
  yearOfEnrollment: Yup.number()
    .positive('Năm nhập học phải là số nguyên dương')
    .integer('Năm nhập học phải là số nguyên')
    .max(9999, 'Năm nhập học không được lớn hơn 9999')
    .min(1000, 'Năm nhập học phải có ít nhất 4 chữ số')
    .required('Năm nhập học là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ có thể chứa các chữ số')
    .max(15, 'Số điện thoại không được vượt quá 15 ký tự')
    .required('Số điện thoại là bắt buộc'),
  gpa: Yup.number()
    .typeError('Vui lòng nhập một số hợp lệ')
    .positive('Điểm trung bình không được âm')
    .integer('Điểm trung bình phải là số nguyên')
    .min(0.0, 'Điểm trung bình không được nhỏ hơn 0.0')
    .max(10.0, 'Điểm trung bình không được lớn hơn 10.0')
    .test(
      'decimal',
      'Điểm trung bình chỉ được phép có tối đa 2 chữ số thập phân',
      value => value === undefined || /^[0-9]+(\.[0-9]{1,2})?$/.test(String(value))
    )
    .required('Điểm trung bình là bắt buộc'),
  dateOfBirth: Yup.string(),
  gender: Yup.string(),
  address: Yup.string().required('Địa chỉ cụ thể sinh viên là bắt buộc').max(255, 'Địa chỉ cụ thể không được quá 255 kí tự'),
  studentStatus: Yup.string(),
  majorId: Yup.number().required('Khoa là bắt buộc'),
  ward_id: Yup.number().required('Xã/Phường là bắt buộc'),
  district_id: Yup.number().required('Quận/Huyện là bắt buộc'),
  province_id: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
});

export default validationSchemaAddStudent;
