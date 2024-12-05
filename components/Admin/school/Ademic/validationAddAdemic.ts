import * as Yup from 'yup';

const validationSchemaAddAdemic = Yup.object({
  full_name: Yup.string().required('Tên nhân viên là bắt buộc').max(50, 'Tên nhân viên không được quá 50 kí tự'),
  employee_code: Yup.string().required('Mã nhân viên là bắt buộc').max(50, 'Mã nhân viên không được quá 50 kí tự'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(50, 'Email không được quá 50 kí tự'),
  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính phải là Nam, Nữ hoặc Khác').required('Giới tính là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  phone_number: Yup.string()
    .matches(/^\d+$/, 'Số điện thoại phải là số')
    .required('Số điện thoại là bắt buộc')
    .max(15, 'Số điện thoại không được quá 15 ký tự'),
  data_of_birth: Yup.date().required('Ngày tháng năm sinh là bắt buộc').max(new Date(), 'Ngày tháng năm sinh không được lớn hơn ngày hiện tại').nullable(),
  avatarUrl: Yup.mixed()
    .test('fileType', 'Chỉ chấp nhận định dạng JPG hoặc PNG', value => {
      if (!value) return true; // Không bắt buộc
      return value instanceof File && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type);
    })
    .test('fileSize', 'Kích thước file không được quá 2MB', value => {
      if (!value) return true; // Không bắt buộc
      return value instanceof File && value.size <= 2 * 1024 * 1024; // 2MB
    }),
});

export default validationSchemaAddAdemic;
