import * as Yup from 'yup';

const validationSchemaAddStudent = Yup.object({
  fullName: Yup.string().required('Tên sinh viên là bắt buộc').max(100, 'Tên sinh viên không được quá 100 kí tự'),
  studentCode: Yup.string().required('Mã sinh viên là bắt buộc').max(50, 'Mã sinh viên không được quá 50 kí tự'),

  facultyDescription: Yup.string(),
  yearOfEnrollment: Yup.number()
    .positive('Năm nhập học phải là số nguyên dương')
    .integer('Năm nhập học phải là số nguyên')
    .max(9999, 'Năm nhập học không được lớn hơn 9999')
    .min(1000, 'Năm nhập học phải có ít nhất 4 chữ số')
    .required('Năm nhập học là bắt buộc'),
  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính phải là Nam, Nữ hoặc Khác').required('Giới tính là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc').max(150, 'Địa chỉ không được quá 150 kí tự'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(50, 'Email không được quá 50 kí tự'),
  gpa: Yup.number()
    .min(0.0, 'Điểm trung bình không được nhỏ hơn 0.0')
    .max(10.0, 'Điểm trung bình không được lớn hơn 10.0')
    .test('decimal', 'Điểm trung bình chỉ được phép có tối đa 2 chữ số thập phân', value => {
      return /^[0-9]+(\.[0-9]{1,2})?$/.test(String(value)); // Kiểm tra số thập phân với tối đa 2 chữ số thập phân
    })
    .required('Điểm trung bình là bắt buộc'),
  studentStatus: Yup.string().oneOf(['In Progress', 'Graduated', 'Dropped Out'], 'Trạng thái học tập không hợp lệ').required('Trạng thái học tập là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ có thể chứa các chữ số')
    .max(15, 'Số điện thoại không được vượt quá 15 ký tự')
    .required('Số điện thoại là bắt buộc'),
});

export default validationSchemaAddStudent;
