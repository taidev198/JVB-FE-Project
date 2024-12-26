import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Text from '@/components/Common/Text';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useDetailDepartmentsQuery, useUpdateDepartmentMutation } from '@/services/adminSchoolApi';
import validationSchemaUpdateDepartment from '@/components/Admin/school/Department/validationUpdateDepartment';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

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
        await updateDepartment({ formData: data, id: IdDepartment }).unwrap();
        toast.success('Sửa khoa thành công');
        router.push('/admin/school/department');
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
          toast.error(errMsg);
        } else if (isErrorWithMessage(error)) {
          toast.error(error.message);
        }
      }
    } else {
      console.error('Ademic ID is missing');
    }
  };

  useEffect(() => {
    if (department?.data) {
      reset(department?.data);
    }

    dispatch(setLoading(isLoadingDetailDepartment));
  }, [dispatch, isLoadingDetailDepartment, reset, department, isSuccess]);
  return (
    <div className="rounded-lg ">
      <form onSubmit={handleSubmit(onSubmit)} className="h h-screen w-full rounded-lg bg-white px-5">
        <div className="p-5">
          <Link href={'/admin/school/department'}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          Trở về
          <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật khoa </h1>
        </div>
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="Mã khoa"
            placeholder="Nhập mã khoa"
            control={control}
            error={errors.facultyCode?.message}
            {...register('facultyCode', { required: 'Mã khoa là bắt buộc' })}
            required={true}
            disabled={true}
          />
          <Input
            type="text"
            label="Tên khoa"
            placeholder="Nhập tên khoa"
            control={control}
            error={errors.facultyName?.message}
            {...register('facultyName', { required: 'Tên khoa là bắt buộc' })}
            required={true}
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
            required={true}
          />
        </div>
        <div className="mt-5 flex flex-col gap-5">
          <Input
            type="text"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            control={control}
            error={errors.address?.message}
            {...register('address', { required: 'Địa chỉ là bắt buộc' })}
            required={true}
          />

          <Text label="Mô tả khoa" placeholder="Nhập mô tả khoa" control={control} {...register('facultyDescription')} />
          <div className="ml-auto w-fit">
            <Button text="Cập nhật" full={true} type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateDepartment;
