import * as Yup from 'yup';

export interface FormDataRegisterSchool {
  companyName: string;
  companyCode: string;
  companyDescription: string;
  phoneNumber: string;
  houseNumber: string;
  wardId: number;
  email: string;
  password: string;
  confirm_password: string;
  districtId: number;
  provinceId: number;
  establishDate: string;
  taxCode: string;
}

const registerValidateCompany = Yup.object({
  companyName: Yup.string().required('Tên doanh nghiệp là bắt buộc').max(50, 'Tên doanh nghiệp không được quá 50 kí tự'),
  companyCode: Yup.string().required('Mã doanh nghiệp là bắt buộc').max(30, 'Mã doanh nghiệp không được quá 30 kí tự'),
  establishDate: Yup.string().required('Ngày thành lập là bắt buộc'),
  email: Yup.string()
    .required('Email là bắt buộc')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .max(50, 'Email không được quá 50 kí tự'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu không trùng khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  companyDescription: Yup.string().required('Mô tả là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  provinceId: Yup.number().typeError('Tỉnh must be a number').required('Tỉnh là bắt buộc'),
  districtId: Yup.number().typeError('Huyện must be a number').required('Huyện là bắt buộc'),
  wardId: Yup.number().typeError('Xã must be a number').required('Xã là bắt buộc'),
  houseNumber: Yup.string().required('Chi tiết địa chỉ là bắt buộc'),
  taxCode: Yup.string().required('Mã số thuế là bắt buộc').max(30, 'Mã số thuế không được quá 30 kí tự'),
});

export default registerValidateCompany;
