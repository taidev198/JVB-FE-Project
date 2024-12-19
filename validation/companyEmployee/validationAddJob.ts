import * as Yup from 'yup';

const validationSchemaAddJob = Yup.object({
  jobTitle: Yup.string().required('Tiêu đề không được để trống'),
  jobDescription: Yup.string().required('Mô tả không được để trống'),
  requirements: Yup.string().required('Yêu cầu không được để trống'),
  benifits: Yup.string().required('Phúc lợi không được để trống'),

  expirationDate: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),
  workTime: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),

  jobType: Yup.string().required('Loại công việc không được để trống'),
  jobLevel: Yup.string().required('Cấp bậc công việc không được để trống'),
  maxSalary: Yup.number().required('Mức lương không được để trống'),

  minSalary: Yup.number().required('Mức lương không được để trống'),

  memberOfCandidate: Yup.string().required('Số lượng không được để trống'),
  salary_type: Yup.string().required('Lương không được để trống'),
  jobField: Yup.array().of(Yup.number().required('Mỗi phần tử trong lĩnh vực phải là số')).required('Danh sách lĩnh vực là bắt buộc'),
});

export default validationSchemaAddJob;
