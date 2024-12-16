import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Text from '@/components/Common/Text';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useDetailDepartmentsQuery, useUpdateDepartmentMutation } from '@/services/adminSchoolApi';
import validationSchemaUpdateDepartment from '@/components/Admin/school/Department/validationUpdateDepartment';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { setToast } from '@/store/slices/toastSlice';

interface FormDataUpdateDepartment {
  facultyCode: string;
  facultyName: string;
  establishYear: number;
  nameDean: string;
  address: string;
  facultyDescription?: string;
}

const UpdateDepartment = () => {
  const IdDepartment = useAppSelector(state => state.global.id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: department, isLoading: isLoadingDetailDepartment } = useDetailDepartmentsQuery({ id: IdDepartment });
  const [updateDepartment, { isSuccess }] = useUpdateDepartmentMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataUpdateDepartment>({
    resolver: yupResolver(validationSchemaUpdateDepartment),
  });

  const onSubmit: SubmitHandler<FormDataUpdateDepartment> = async data => {
    if (IdDepartment) {
      try {
        const response = await updateDepartment({ formData: data, id: IdDepartment }).unwrap();
        if (response) {
          await refetch();
          router.push('/admin/school/department');
        }
      } catch (error) {
        console.error('Department ID is missing', error);
      }
    }
  };

  useEffect(() => {
    if (department?.data) {
      reset(department?.data);
    }

    if (isSuccess) {
      dispatch(setToast({ message: department?.message || 'Cập nhật thành công!' }));
    }

    dispatch(setLoading(isLoadingDetailDepartment));
  }, [dispatch, isLoadingDetailDepartment, reset, department, isSuccess]);

  const { refetch } = useDetailDepartmentsQuery({ id: IdDepartment });

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white px-5 sm:px-0">
        {/* Icon */}
        <div className="p-5">
          <Link href={'/admin/school/department'}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          Trở về
        </div>
        <h1 className="my-10 ml-5 text-2xl font-bold">Cập nhật khoa</h1>
        <div className="ml-5 mr-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            type="number"
            name="establishYear"
            label="Năm thành lập"
            placeholder="Nhập năm thành lập"
            control={control}
            error={errors.establishYear?.message}
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
        <div className="ml-5 mr-5 bg-white">
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
        </div>
      </form>
    </div>
  );
};

export default UpdateDepartment;
