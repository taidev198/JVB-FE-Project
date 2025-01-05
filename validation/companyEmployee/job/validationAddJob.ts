import * as Yup from 'yup';

const validationSchemaAddJob = Yup.object({
  job_title: Yup.string().required('Tiêu đề là bắt buộc'),
  job_description: Yup.string().required('Mô tả là bắt buộc'),
  requirements: Yup.string().required('Yêu cầu là bắt buộc'),
  benifits: Yup.string().required('Phúc lợi là bắt buộc'),
  expiration_date: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),
  work_time: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),
  job_type: Yup.string().required('Loại công việc là bắt buộc'),
  job_level: Yup.string().required('Cấp bậc công việc là bắt buộc'),
  member_of_candidate: Yup.number()
    .nullable()
    .required('Số lượng là bắt buộc')
    .positive('Giá trị phải là số dương')
    .typeError('Số lượng phải là một số hợp lệ'),
  salary_type: Yup.string().required('Lương là bắt buộc'),
  job_field: Yup.array()
    .required('Danh sách lĩnh vực là bắt buộc')
    .of(Yup.number().typeError('Mỗi phần tử trong lĩnh vực phải là số').required('là bắt buộc'))
    .min(1, 'Phải chọn ít nhất một lĩnh vực'),
  min_salary: Yup.number()
    .nullable()
    .typeError('Giá trị không hợp lệ')
    .when('salary_type', {
      is: 'FIXED', // Chỉ validate khi salary_type === 'FIXED'
      then: schema => schema.required('Mức lương tối thiểu là bắt buộc').max(Yup.ref('max_salary'), 'Mức lương tối thiểu phải nhỏ hơn mức lương tối đa'),
      otherwise: schema => schema.notRequired(),
    }),
  max_salary: Yup.number()
    .nullable()
    .typeError('Giá trị không hợp lệ')
    .when('salary_type', {
      is: 'FIXED', // Chỉ validate khi salary_type === 'FIXED'
      then: schema => schema.required('Mức lương tối đa là bắt buộc').min(Yup.ref('min_salary'), 'Mức lương tối đa phải lớn hơn mức lương tối thiểu'),
      otherwise: schema => schema.notRequired(),
    }),
});

export default validationSchemaAddJob;
