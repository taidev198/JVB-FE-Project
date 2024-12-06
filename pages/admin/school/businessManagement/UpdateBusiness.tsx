import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import Text from '@/components/Common/Text';
import { setBackdrop } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import SelectMui from '@/components/Common/SelectMui';
import validationSchemaAddBusiness from '@/components/Admin/school/Business/validationAddBusiness';
import Select from '@/components/Common/Select';

interface FormDataUpdateBusiness {
  majorCode: string;
  majorName: string;
  creditRequirement: number;
  majorDescription?: string;
  numberOfStudents: number;
  facultyId: number;
  fieldIds: number[];
}

const UpdateBusiness = () => {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataUpdateBusiness>({
    resolver: yupResolver(validationSchemaAddBusiness),
  });

  const onSubmit: SubmitHandler<FormDataUpdateBusiness> = () => {};

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0">
        <div className="mb-4 flex justify-end">
          <IconButton onClick={() => dispatch(setBackdrop(null))}>
            <CloseIcon />
          </IconButton>
        </div>
        <h1 className="my-10 text-2xl font-bold">Cập nhật ngành học</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="Mã ngành"
            placeholder="Nhập mã ngành học"
            control={control}
            error={errors.majorCode?.message}
            {...register('majorCode', { required: 'Mã ngành học là bắt buộc' })}
          />
          <Input
            type="text"
            label="Tên Ngành"
            placeholder="Nhập tên ngành"
            control={control}
            error={errors.majorName?.message}
            {...register('majorName', { required: 'Tên ngành học là bắt buộc' })}
          />
          <Input
            type="number"
            label="Số tín chỉ"
            placeholder="Nhập số tín chỉ ngành học"
            control={control}
            error={errors.creditRequirement?.message}
            {...register('creditRequirement', { required: 'Số tín chỉ là bắt buộc' })}
          />

          <Input
            type="number"
            label="Số lượng sinh viên"
            placeholder="Nhập số lượng sinh viên"
            control={control}
            error={errors.numberOfStudents?.message}
            {...register('numberOfStudents', { required: 'Số lượng sinh viên là bắt buộc' })}
          />
          <Select
            label="Khoa"
            control={control}
            options={[
              { value: '0', label: 'Chọn' },
              { value: '3', label: 'CNTT' },
              { value: '4', label: 'TKDH' },
              { value: '5', label: 'TY' },
            ]}
            error={errors.facultyId?.message}
            {...register('facultyId', { required: 'Khoa là bắt buộc' })}
          />
          <SelectMui
            label="Lĩnh vực"
            control={control}
            options={[
              { value: 1, label: 'Kỹ thuật phần mềm' },
              { value: 2, label: 'Hệ thống thông tin' },
              { value: 3, label: 'Mạng máy tính' },
              { value: 4, label: 'Trí tuệ nhân tạo' },
            ]}
            isMultiple={true}
            error={errors.fieldIds?.message}
            {...register('fieldIds', { required: 'Lĩnh vực là bắt buộc' })}
          />
        </div>

        <Text
          label="Mô tả ngành học"
          placeholder="Nhập mô tả ngành học"
          control={control}
          error={errors.majorDescription?.message}
          {...register('majorDescription')}
        />
        <Button text="Cập nhật" full={true} type="submit" />
      </form>
    </div>
  );
};

export default UpdateBusiness;
