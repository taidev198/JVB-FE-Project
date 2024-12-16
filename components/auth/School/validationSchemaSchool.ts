import * as Yup from 'yup';

export interface FormDataRegisterSchool {
  universityName: string;
  universityCode: string;
  email: string;
  password: string;
  confirm_password: string;
  phoneNumber: string;
  wardId: number;
  districtId: number;
  provinceId: number;
  establishDate: string;
  houseNumber: string;
  universityType: string;
  universityDescription: string;
}

const validationSchemaSchool = Yup.object({
  universityName: Yup.string().required('Tên trường học là bắt buộc').max(50, 'Tên trường học không được quá 50 kí tự'),
  universityCode: Yup.string().required('Mã trường học là bắt buộc').max(30, 'Mã trường học không được quá 30 kí tự'),
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
  universityDescription: Yup.string().required('Mô tả chi tiết là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
  establishDate: Yup.string().nullable().required('Ngày thành lập là bắt buộc').typeError('Giá trị không hợp lệ'),
  houseNumber: Yup.string().required('Chi tiết địa chỉ là bắt buộc'),
  universityType: Yup.string().required('Loại trường là bắt buộc'),
});

export default validationSchemaSchool;
