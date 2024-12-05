import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useDispatch } from 'react-redux';
import validationSchemaAddStudent from './validationAddStudent';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { setBackdrop } from '@/store/slices/global';

interface FormDataAddStudent {
  studentCode: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  gender: string;
  phoneNumber: string;
  yearOfEnrollment: number;
  address: string;
  gpa: number;
  dateOfBirth: string;
  studentStatus: string;
  majorId: number;
}

const AddStudent = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddStudent>({
    resolver: yupResolver(validationSchemaAddStudent),
  });

  const onSubmit: SubmitHandler<FormDataAddStudent> = () => {
    // const { confirm_password, ...payload } = data;
    // console.log({ payload });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold"> Thêm mới sinh viên</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Các trường thông tin khác */}

          <Input type="text" name="studentCode" label="Mã sinh viên" placeholder="Nhập mã sinh viên" control={control} error={errors.studentCode?.message} />
          <Input type="text" name="fullName" label="Tên sinh viên" placeholder="Nhập tên sinh viên" control={control} error={errors.fullName?.message} />
          <Controller
            name="yearOfEnrollment"
            control={control}
            render={({ field }) => (
              <div className="mb-4 flex flex-col">
                {/* Nhãn */}
                <label htmlFor="yearOfEnrollment" className="mb-1 font-medium text-gray-700">
                  Năm nhập học
                </label>

                {/* Input */}
                <input
                  {...field}
                  id="yearOfEnrollment"
                  type="date" // Chuyển từ kiểu date sang kiểu number
                  placeholder="Nhập năm nhập học"
                  className={`border ${
                    errors.yearOfEnrollment ? 'border-red-500' : 'border-gray-300'
                  } rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                />

                {/* Hiển thị lỗi */}
                {errors.yearOfEnrollment && <p className="mt-1 text-sm text-red-500">{errors.yearOfEnrollment.message}</p>}
              </div>
            )}
          />

          <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
          <Controller
            name="gpa"
            control={control}
            render={({ field }) => (
              <div className="mb-4 flex flex-col">
                {/* Nhãn */}
                <label htmlFor="gpa" className="mb-1 font-medium text-gray-700">
                  Điểm trung bình (GPA)
                </label>

                {/* Ô input */}
                <input
                  {...field}
                  id="gpa"
                  type="number" // Input là dạng số
                  step="0.01" // Đảm bảo nhập số thập phân
                  placeholder="Nhập GPA"
                  className={`border ${errors.gpa ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                />

                {/* Hiển thị lỗi */}
                {errors.gpa && <p className="mt-1 text-sm text-red-500">{errors.gpa.message}</p>}
              </div>
            )}
          />

          <Controller
            name="studentStatus"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.studentStatus?.message}>
                <InputLabel>Trạng thái</InputLabel>
                <Select {...field} label="Trạng thái">
                  <MenuItem value="0">Chọn</MenuItem>
                  <MenuItem value="GRADUATED">GRADUATED</MenuItem>
                  <MenuItem value="DROPPED OUT">DROPPED OUT</MenuItem>
                  <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
                </Select>
                {errors.studentStatus?.message && <FormHelperText>{errors.studentStatus.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Trường giới tính */}
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.gender?.message}>
                <InputLabel>Giới tính</InputLabel>
                <Select {...field} label="Giới tính">
                  <MenuItem value="MALE">MALE</MenuItem>
                  <MenuItem value="FEMALE">FEMALE</MenuItem>
                  <MenuItem value="OTHER">OTHER</MenuItem>
                </Select>
                {errors.gender?.message && <FormHelperText>{errors.gender.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </div>

        <Input type="text" name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} error={errors.address?.message} />

        <Button text="Thêm" full={true} type="submit" />
      </form>
    </div>
  );
};

export default AddStudent;
