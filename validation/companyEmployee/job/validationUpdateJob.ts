import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

const validationUpdateJob = Yup.object({
  job_title: Yup.string().required('Tiêu đề không được để trống'),
  job_description: Yup.string().required('Mô tả không được để trống'),
  requirements: Yup.string().required('Yêu cầu không được để trống'),
  benifits: Yup.string().required('Phúc lợi không được để trống'),

  expiration_date: Yup.mixed<Dayjs>()
    .test('is-dayjs', 'Invalid date', value => dayjs.isDayjs(value))
    .required('Ngày hết hạn là bắt buộc'),
  work_time: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),

  job_type: Yup.string().required('Loại công việc không được để trống'),
  job_level: Yup.string().required('Cấp bậc công việc không được để trống'),

  member_of_candidate: Yup.number().typeError('Amount must be a number').required('Số lượng không được để trống'),
  salary_type: Yup.string().required('Lương không được để trống'),
  job_field: Yup.array()
    .of(Yup.number().typeError('Mỗi phần tử trong lĩnh vực phải là số').required('Không được để trống'))
    .min(1, 'Phải chọn ít nhất một lĩnh vực')
    .required('Danh sách lĩnh vực là bắt buộc'),
  max_salary: Yup.number()
    .typeError('Giá trị không hợp lệ')
    .required('Mức lương tối thiểu không được để trống')
    .min(0, 'Mức lương tối thiểu phải lớn hơn hoặc bằng 0'),

  min_salary: Yup.number()
    .typeError('Giá trị không hợp lệ')
    .required('Mức lương tối đa không được để trống')
    .min(Yup.ref('max_salary'), 'Mức lương tối đa phải lớn hơn mức lương tối thiểu'),
});

export default validationUpdateJob;
