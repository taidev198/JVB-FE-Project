/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton } from '@mui/material';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import Text from '@/components/Common/Text';
import { setLoading } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import ValidationSchemaUpdateBusiness from '@/components/Admin/school/Business/validationUpdateBusiness ';
import Input from '@/components/Common/Input';
import { useAppSelector } from '@/store/hooks';
import SelectReact from '@/components/Common/SelectMui';
import { useGetAllFieldsQuery, useGetAllMajorByQuery, useGetDetailBusinessQuery, useUpdateBusinessMutation } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface FormDataUpdateBusiness {
  majorCode: string;
  majorName: string;
  creditRequirement: number;
  majorDescription?: string;
  facultyId: number;
  fieldIds: number[];
}
const UpdateBusiness = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataUpdateBusiness>({
    resolver: yupResolver(ValidationSchemaUpdateBusiness) as Resolver<FormDataUpdateBusiness>,
  });
  const { data: majores, isLoading: isLoadingMajor } = useGetAllMajorByQuery();
  const { data: faculties, isLoading: isLoadingFaculies } = useGetAllFieldsQuery();
  const idBusiness = useAppSelector(state => state.global.id);
  const [updateBusiness] = useUpdateBusinessMutation();
  const { data: business, isLoading: isLoadingDetailBusiness } = useGetDetailBusinessQuery({ id: idBusiness });
  const onSubmit: SubmitHandler<FormDataUpdateBusiness> = async data => {
    if (idBusiness) {
      try {
        await updateBusiness({ formData: data, id: idBusiness }).unwrap();
        toast.success('Sửa ngành học thành công');
        router.push('/admin/school/businessManagement');
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
          toast.error(errMsg);
        } else if (isErrorWithMessage(error)) {
          toast.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    if (business?.data) {
      reset({
        majorCode: business.data.majorCode,
        majorName: business.data.majorName,
        creditRequirement: business.data.creditRequirement,
        majorDescription: business.data.majorDescription,
        facultyId: business.data.faculty.id,
        fieldIds: business.data.majorFields.map(field => field.id),
      });
    }

    dispatch(setLoading(isLoadingDetailBusiness || isLoadingFaculies || isLoadingMajor));
  }, [dispatch, isLoadingDetailBusiness, isLoadingMajor, isLoadingFaculies, reset]);

  return (
    <div className="bg-primary-white p-6">
      <div className="rounded-t-lg bg-white p-5">
        <Link href={'/admin/school/businessManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-primary-white px-5 sm:px-0">
        <h1 className="my-10 text-2xl font-bold">Cập nhật ngành học</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="text"
            label="Mã ngành"
            placeholder="Nhập mã ngành học"
            control={control}
            error={errors.majorCode?.message}
            {...register('majorCode', { required: 'Mã ngành học là bắt buộc' })}
            required={true}
            disabled={true}
          />

          <Input
            type="text"
            label="Tên Ngành"
            placeholder="Nhập tên ngành"
            control={control}
            error={errors.majorName?.message}
            {...register('majorName', { required: 'Tên ngành học là bắt buộc' })}
            required={true}
          />
          <Input
            type="number"
            label="Số tín chỉ"
            placeholder="Nhập số tín chỉ ngành học"
            control={control}
            error={errors.creditRequirement?.message}
            {...register('creditRequirement', { required: 'Số tín chỉ là bắt buộc' })}
            required={true}
          />

          <SelectReact
            name="facultyId"
            label="Khoa"
            placeholder="Chọn khoa"
            options={(majores?.data || []).map(major => ({
              value: major.id,
              label: major.facultyName,
            }))}
            control={control}
            error={errors.facultyId?.message}
            required={true}
          />
          <SelectReact
            name="fieldIds"
            label="Lĩnh vực"
            placeholder="Chọn lĩnh vực"
            options={(faculties?.data || []).map(faculty => ({
              value: faculty.id,
              label: faculty.fieldName,
            }))}
            control={control}
            isMultiple={true}
            error={errors.fieldIds?.message}
            required={true}
          />
        </div>
        <div className="mt-5">
          <Text
            label="Mô tả ngành học"
            placeholder="Nhập mô tả ngành học"
            control={control}
            error={errors.majorDescription?.message}
            {...register('majorDescription')}
          />
          <div className="ml-auto mt-5 w-fit ">
            <Button text="Cập nhật" type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateBusiness;
