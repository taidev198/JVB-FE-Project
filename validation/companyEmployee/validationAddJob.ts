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
  // maxSalary: Yup.number().required('Mức lương không được để trống'),

  // minSalary: Yup.number().required('Mức lương không được để trống'),

  memberOfCandidate: Yup.string().required('Số lượng không được để trống'),
  salary_type: Yup.string().required('Lương không được để trống'),
  jobField: Yup.number().required('Lĩnh vực không được để trống'),
  maxSalary: Yup.number()
    .typeError('Giá trị không hợp lệ')
    .required('Mức lương tối thiểu không được để trống')
    .min(0, 'Mức lương tối thiểu phải lớn hơn hoặc bằng 0'),

  minSalary: Yup.number()
    .typeError('Giá trị không hợp lệ')
    .required('Mức lương tối đa không được để trống')
    .min(Yup.ref('maxSalary'), 'Mức lương tối đa phải lớn hơn mức lương tối thiểu'),
});

export default validationSchemaAddJob;
