import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

const validationSchemaAddStudent = Yup.object({
  fullName: Yup.string().required('Tên sinh viên là bắt buộc').max(100, 'Tên sinh viên không được quá 100 kí tự'),
  studentCode: Yup.string().required('Mã sinh viên là bắt buộc').max(50, 'Mã sinh viên không được quá 50 kí tự'),
  email: Yup.string()
    .required('Email là bắt buộc')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không đúng định dạng')
    .max(50, 'Email không được quá 50 kí tự'),
  yearOfEnrollment: Yup.number()
    .required('Năm nhập học là bắt buộc')
    .typeError('Năm nhập học phải là số')
    .positive('Năm nhập học phải là số nguyên dương')
    .integer('Năm nhập học phải là số nguyên')
    .min(1000, 'Năm nhập học phải có ít nhất 4 chữ số')
    .max(9999, 'Năm nhập học không được lớn hơn 9999')
    .test('is-less-than-established-year', 'Năm nhập học phải sau năm thành lập trường', function (value) {
      const establishedDate = this.parent.establishedDate;
      if (value && establishedDate) {
        const establishedYear = dayjs(establishedDate).year();
        return value < establishedYear;
      }
      return true;
    })
    .test('is-not-future-year', 'Năm nhập học không được là năm hiện tại hoặc tương lai', function (value) {
      const currentYear = dayjs().year();
      if (value >= currentYear) {
        return false;
      }
      return true;
    }),
  phoneNumber: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số'),
  gpa: Yup.number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('Điểm trung bình là bắt buộc')
    .positive('Điểm trung bình không được âm')
    .min(0.0, 'Điểm trung bình không được nhỏ hơn 0.0')
    .max(4.0, 'Điểm trung bình không được lớn hơn 4.0')
    .test(
      'decimal',
      'Điểm trung bình chỉ được phép có tối đa 2 chữ số thập phân',
      value => value === undefined || /^[0-9]+(\.[0-9]{1,2})?$/.test(String(value))
    ),
  dateOfBirth: Yup.mixed<Dayjs>()
    .test('is-dayjs', 'Ngày sinh không hợp lệ', value => dayjs.isDayjs(value))
    .test('is-valid-date', 'Ngày sinh không được là ngày hiện tại hoặc ngày trong tương lai', value => {
      if (value) {
        const currentDate = dayjs();
        return value.isBefore(currentDate, 'day');
      }
      return false;
    })
    .required('Ngày sinh là bắt buộc'),
  gender: Yup.string().required('Giới tính là bắt buộc'),
  houseNumber: Yup.string().required('Địa chỉ cụ thể sinh viên là bắt buộc').max(255, 'Địa chỉ cụ thể không được quá 255 kí tự'),
  studentStatus: Yup.string().required('Trạng thái là bắt buộc'),
  majorId: Yup.number().required('Khoa là bắt buộc'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
});

export default validationSchemaAddStudent;
