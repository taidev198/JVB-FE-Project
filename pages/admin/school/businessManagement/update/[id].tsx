import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import Text from '@/components/Common/Text';
import { setBackdrop, setLoading } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from '@/store/hooks';
import SelectReact from '@/components/Common/SelectMui';
import { useGetAllFieldsQuery, useGetAllMajorByQuery, useGetDetailBusinessQuery, useUpdateBusinessMutation } from '@/services/adminSchoolApi';
import { setToast } from '@/store/slices/toastSlice';
import ValidationSchemaUpdateBusiness from '@/components/Admin/school/Business/validationUpdateBusiness ';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

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
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataUpdateBusiness>({
    resolver: yupResolver(ValidationSchemaUpdateBusiness),
  });
  const { data: majores, isLoading: isLoadingMajor } = useGetAllMajorByQuery();
  const { data: faculties, isLoading: isLoadingFaculies } = useGetAllFieldsQuery();
  const idBusiness = useAppSelector(state => state.global.id);
  const [updateBusiness] = useUpdateBusinessMutation();
  const { data: business, isLoading: isLoadingDetailBusiness } = useGetDetailBusinessQuery({ id: idBusiness });
  const onSubmit: SubmitHandler<FormDataUpdateBusiness> = async data => {
    if (idBusiness) {
      try {
        const response = await updateBusiness({ formData: data, id: idBusiness }).unwrap();
        toast.success(response.message);
        if (response) {
          router.push('/admin/school/businessManagement');
        }
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
        numberOfStudents: business.data.numberOfStudents,
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

          <Input
            type="number"
            label="Số lượng sinh viên"
            placeholder="Nhập số lượng sinh viên"
            control={control}
            error={errors.numberOfStudents?.message}
            {...register('numberOfStudents', { required: 'Số lượng sinh viên là bắt buộc' })}
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
          <Button text="Cập nhật" full={true} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateBusiness;
