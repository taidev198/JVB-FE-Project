import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import validationSchemaAddAdemic from './validationAddAdemic';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { setBackdrop } from '@/store/slices/global';

import ImageUploaderOne from '@/components/Common/ImageUploaderOne';

interface FormDataAddAdemic {
  full_name: string;
  employee_code: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  data_of_birth: string;
  gender: string;
  email: string;
}

const AddAdemic = () => {
  const [image, setImage] = useState<File | null>(null);
  image;

  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddAdemic>({
    resolver: yupResolver(validationSchemaAddAdemic),
  });
  const onSubmit: SubmitHandler<FormDataAddAdemic> = () => {
    // console.log('Dữ liệu hợp lệ:', data);
    // Xử lý gửi dữ liệu ở đây
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold">Thêm mới giáo vụ</h1>
        <ImageUploaderOne image={image} setImage={setImage} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            name="employee_code"
            label="Mã nhân viên"
            placeholder="Nhập mã nhân viên"
            control={control}
            error={errors.employee_code?.message}
          />
          <Input type="text" name="full_name" label="Họ và tên" placeholder="Nhập họ và tên" control={control} error={errors.full_name?.message} />
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
          <Input type="text" name="email" label="Email" placeholder="Nhập email" control={control} error={errors.email?.message} />
          <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập Mật khẩu" control={control} error={errors.password?.message} />
          <Input
            type="password"
            name="confirm_password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            control={control}
            error={errors.confirm_password?.message}
          />

          <Input type="date" name="data_of_birth" label="Ngày sinh" placeholder="Nhập ngày sinh" control={control} error={errors.data_of_birth?.message} />
        </div>
        <Button text="Thêm" full={true} type="submit" className="mt-5" />
      </form>
    </div>
  );
};

export default AddAdemic;
