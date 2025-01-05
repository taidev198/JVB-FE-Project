import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

const updateWorkshopSchema = Yup.object({
  workshopTitle: Yup.string().required('Tên doanh nghiệp là bắt buộc').max(150, 'Tiêu đề tối đa 150 kí tự'),
  workshopDescription: Yup.string().required('Mô tả là bắt buộc'),
  startTime: Yup.mixed<Dayjs>()
    .test('is-dayjs', 'Invalid date', value => dayjs.isDayjs(value))
    .required('Thời gian bắt đầu là bắt buộc'),

  endTime: Yup.mixed<Dayjs>()
    .test('is-dayjs', 'Invalid date', value => dayjs.isDayjs(value))
    .required('Thời gian kết thúc làà bắt buộc'),
  estimateCompanyParticipants: Yup.number()
    .required('Số lượng công ty là bắt buộc')
    .positive('Số lượng công ty không được âm')
    .integer('Số lượng công ty phải là một số nguyên')
    .typeError('Vui lòng nhập một số hợp lệ'),
  wardId: Yup.number().notRequired().nullable(),
  districtId: Yup.number().notRequired().nullable(),
  provinceId: Yup.number().notRequired().nullable(),
  houseNumber: Yup.string().required('Chi tiết địa chỉ là bắt buộc'),
  agenda: Yup.string().required('Lịch trình là bắt buộc'),
  fields: Yup.array().of(Yup.number().required('Mỗi phần tử trong lĩnh vực phải là số')).required('Danh sách lĩnh vực là bắt buộc'),
});

export default updateWorkshopSchema;
