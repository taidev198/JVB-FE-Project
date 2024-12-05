import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import validationSchemaAddDepartment from '../../../../components/Admin/school/Department/validationAddDepartment';
import Text from '@/components/Common/Text';
import { setBackdrop } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';

interface FormDataUpdateDepartment {
  facultyCode: string;
  facultyName: string;
  establishYear: string;
  nameDean: string;
  address: string;
  facultyDescription?: string;
}

const UpdateDepartment = ({ departmentData }: { departmentData: FormDataUpdateDepartment }) => {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataUpdateDepartment>({
    resolver: yupResolver(validationSchemaAddDepartment),
  });

  // Reset form với dữ liệu hiện có khi component mount
  React.useEffect(() => {
    reset(departmentData);
  }, [departmentData, reset]);

  const onSubmit: SubmitHandler<FormDataUpdateDepartment> = () => {};

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold">Cập nhật khoa</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="Mã khoa"
            placeholder="Nhập mã khoa"
            control={control}
            error={errors.facultyCode?.message}
            {...register('facultyCode', { required: 'Mã khoa là bắt buộc' })}
          />
          <Input
            type="text"
            label="Tên Khoa"
            placeholder="Nhập tên khoa"
            control={control}
            error={errors.facultyName?.message}
            {...register('facultyName', { required: 'Tên khoa là bắt buộc' })}
          />
          <Input
            type="date"
            label="Năm thành lập"
            placeholder="Năm thành lập"
            control={control}
            error={errors.establishYear?.message}
            {...register('establishYear', { required: 'Năm thành lập là bắt buộc' })}
          />
          <Input
            type="text"
            label="Tên trưởng khoa"
            placeholder="Nhập tên trưởng khoa"
            control={control}
            error={errors.nameDean?.message}
            {...register('nameDean', { required: 'Tên trưởng khoa là bắt buộc' })}
          />
        </div>
        <Input
          type="text"
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          control={control}
          error={errors.address?.message}
          {...register('address', { required: 'Địa chỉ là bắt buộc' })}
        />
        <Text
          label="Mô tả khoa"
          placeholder="Nhập mô tả khoa"
          control={control}
          error={errors.facultyDescription?.message}
          {...register('facultyDescription')}
        />
        <Button text="Cập nhật" full={true} type="submit" />
      </form>
    </div>
  );
};

export default UpdateDepartment;
