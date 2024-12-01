import * as Yup from 'yup';

const validationSchema = Yup.object({
  company_name: Yup.string().required('Tên doanh nghiệp là bắt buộc').max(50, 'Tên doanh nghiệp không được quá 50 kí tự'),
  company_code: Yup.string().required('Mã doanh nghiệp là bắt buộc').max(30, 'Mã doanh nghiệp không được quá 30 kí tự'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email là bắt buộc')
    .max(50, 'Email không được quá 50 kí tự'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  company_description: Yup.string().required('Mô tả là bắt buộc'),
  phone_number: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  ward_id: Yup.number().required('Xã/Phường là bắt buộc'),
  district_id: Yup.number().required('Quận/Huyện là bắt buộc'),
  province_id: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
  establish_date: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Ngày thành lập là bắt buộc'),
  number_house: Yup.string().required('Chi tiết địa chỉ là bắt buộc'),
  tax_code: Yup.string().required('Mã số thuế là bắt buộc').max(30, 'Mã số thuế không được quá 30 kí tự'),
});

export default validationSchema;
