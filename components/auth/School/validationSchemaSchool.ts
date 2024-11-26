import * as Yup from 'yup';

const validationSchemaSchool = Yup.object({
  university_name: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(50, 'Tên doanh nghiệp không được quá 50 kí tự'),
  university_code: Yup.string().required('Mã doanh nghiệp không được bỏ trống').max(30, 'Mã doanh nghiệp không được quá 30 kí tự'),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .required('Email không được bỏ trống')
    .max(50, 'Email không được quá 50 kí tự'),
  password: Yup.string()
    .required('Mật khẩu không được bỏ trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  university_description: Yup.string().required('Mô tả không được bỏ trống'),
  phone_number: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Số điện thoại không được bỏ trống'),
  ward_id: Yup.number().required('Xã/Phường không được bỏ trống'),
  district_id: Yup.number().required('Quận/Huyện không được bỏ trống'),
  province_id: Yup.number().required('Tỉnh/Thành phố không được bỏ trống'),
  establish_date: Yup.string().required('Vui lòng chọn ngày thành lập'),
  number_house: Yup.string().required('Chi tiết địa chỉ không được bỏ trống'),
  type_university: Yup.string().required('Mã số thuế không được bỏ trống').max(30, 'Mã số thuế không được quá 30 kí tự'),
});

export default validationSchemaSchool;
