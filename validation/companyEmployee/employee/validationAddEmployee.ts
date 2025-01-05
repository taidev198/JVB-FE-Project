import * as Yup from 'yup';

const validationSchemaAddEmployee = Yup.object({
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
  dateOfBirth: Yup.date()
    .required('Ngày sinh là bắt buộc')
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === '') return null;
      return value;
    })
    .test('is-not-null', 'Ngày sinh không thể là rỗng', value => value !== null)
    .test(
      'is-in-the-past',
      'Ngày sinh phải là ngày trước hiện tại',
      value => value === null || value < new Date() // Kiểm tra ngày sinh nhỏ hơn ngày hiện tại
    )
    .test('is-18-or-older', 'Tuổi phải từ 18 trở lên', value => {
      if (!value) return true; // Bỏ qua nếu giá trị là null
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      const isBirthdayPassed = today.getMonth() > value.getMonth() || (today.getMonth() === value.getMonth() && today.getDate() >= value.getDate());
      return age > 18 || (age === 18 && isBirthdayPassed); // Kiểm tra tuổi >= 18
    }),

  salary: Yup.number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Lương là bắt buộc')
    .positive('Lương phải là số dương'),

  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),

  houseNumber: Yup.string().required('Địa chỉ cụ thể là bắt buộc').max(150, 'Địa chỉ cụ thể không được quá 150 kí tự'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
});

export default validationSchemaAddEmployee;
