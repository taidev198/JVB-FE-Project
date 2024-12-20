import * as Yup from 'yup';

const validationSchemaUpdateSchool = Yup.object({
  universityName: Yup.string().required('Tên trường học là bắt buộc').max(50, 'Tên trường học không được quá 50 kí tự'),
  universityCode: Yup.string().required('Mã trường học là bắt buộc').max(50, 'Mã trường học không được quá 50 kí tự'),
  phoneNumber: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  establishedDate: Yup.string().required('Năm thành lập là bắt buộc'),
  houseNumber: Yup.string().required('Địa chỉ cụ thể trường học là bắt buộc').max(255, 'Địa chỉ cụ thể không được quá 255 kí tự'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
  universityDescription: Yup.string().max(500, 'Mô tả không được quá 500 kí tự'),
  universityShortDescription: Yup.string().max(500, 'Mô tả không được quá 500 kí tự'),
  numberOfGraduates: Yup.number()
    .integer('Số lượng sinh viên tốt nghiệp phải là số nguyên')
    .positive('Số lượng sinh viên tốt nghiệp phải là số dương')
    .nullable(),
  numberOfStudents: Yup.number().integer('Số lượng sinh viên phải là số nguyên').positive('Số lượng sinh viên phải là số dương').nullable(),
  linkWebsite: Yup.string().url('Địa chỉ không hợp lệ, vui lòng nhập một URL hợp lệ').max(255, 'URL không được quá 255 kí tự'),
});

export default validationSchemaUpdateSchool;
