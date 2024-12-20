import * as Yup from 'yup';

const addWorkshopSchema = Yup.object({
  workshopTitle: Yup.string().required('Tên doanh nghiệp là bắt buộc').max(150, 'Tiêu đề tối đa 150 kí tự'),
  workshopDescription: Yup.string().required('Mô tả là bắt buộc'),
  startTime: Yup.string().nullable().typeError('Giá trị không hợp lệ').required('Thời gian bắt đầu là bắt buộc'),
  endTime: Yup.string()
    .nullable()
    .typeError('Giá trị không hợp lệ')
    .required('Thời gian kết thúc là bắt buộc')
    .test('is-greater-than-start', 'Ngày kết thúc không được trước ngày bắt đầu', function (value) {
      const { startTime } = this.parent;
      if (startTime && value && new Date(value) < new Date(startTime)) {
        return false;
      }
      return true;
    }),
  estimateCompanyParticipants: Yup.number()
    .required('Số lượng công ty là bắt buộc')
    .positive('Số lượng công ty không được âm')
    .integer('Số lượng công ty phải là một số nguyên')
    .typeError('Vui lòng nhập một số hợp lệ'),
  wardId: Yup.number().required('Xã/Phường là bắt buộc'),
  districtId: Yup.number().required('Quận/Huyện là bắt buộc'),
  provinceId: Yup.number().required('Tỉnh/Thành phố là bắt buộc'),
  houseNumber: Yup.string().required('Chi tiết địa chỉ là bắt buộc'),
  agenda: Yup.string().required('Lịch trình là bắt buộc'),
  fieldIds: Yup.array()
    .of(Yup.number().typeError('Mỗi phần tử trong lĩnh vực phải là số').required('Không được để trống'))
    .min(1, 'Phải chọn ít nhất một lĩnh vực')
    .required('Danh sách lĩnh vực là bắt buộc'),
});

export default addWorkshopSchema;
