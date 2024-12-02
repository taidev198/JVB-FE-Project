import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Select } from '@mui/material';
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
  yearOfEnrollment: string;
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

          <Input type="text" name="studentCode" label="Mã sinh viên" placeholder="Nhập mã sinh vien" control={control} error={errors.studentCode?.message} />
          <Input type="text" name="fullName" label="Tên sinh viên" placeholder="Nhập tên sinh viên" control={control} error={errors.fullName?.message} />
          <Input
            type="date"
            name="yearOfEnrollment"
            label="Năm nhập học"
            placeholder="Năm nhập học"
            control={control}
            error={errors.yearOfEnrollment?.message}
          />
          <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
          <Select
            name="gender"
            label="Giới tính"
            control={control}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
            error={errors.gender?.message}
          />
        </div>
        <Input type="text" name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" control={control} error={errors.address?.message} />

        <Button text="Thêm " full={true} type="submit" />
      </form>
    </div>
  );
};
export default AddStudent;
