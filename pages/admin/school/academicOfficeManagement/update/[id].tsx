import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { setLoading } from '@/store/slices/global';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Link from 'next/link';
import { gender } from '@/utils/app/const';
import SelectReact from '@/components/Common/SelectMui';
import { useRouter } from 'next/router';
import { useGetDetailAcademicOfficeManagementQuery, useUpdateAdemicMutation } from '@/services/adminSchoolApi';
import toast from 'react-hot-toast';
import validationSchemaUpdateAdemic from '@/components/Admin/school/Ademic/validationUpdateAdemic';
import { useAppSelector } from '@/store/hooks';
import dayjs from 'dayjs';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import DateComponent from '@/components/Common/DateComponent';
import Address from '@/components/Common/Address';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';

interface FormDataUpdateAdemic {
  fullName: string;
  employeeCode: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  gender: string;
  email: string;
  avatarUrl: string;
  wardId: number;
  houseNumber: string;
  provinceId: number;
  districtId: number;
}

const UpdateAdemic = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const methods = useForm<FormDataUpdateAdemic>({
    resolver: yupResolver(validationSchemaUpdateAdemic),
    mode: 'onChange',
    defaultValues: {
      wardId: null,
      districtId: null,
      provinceId: null,
    },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;
  const IdAdemic = useAppSelector(state => state.global.id);
  const { data: ademic, isLoading: isLoadingDetailAdemic } = useGetDetailAcademicOfficeManagementQuery({ id: IdAdemic });
  const [updateAdemic] = useUpdateAdemicMutation();
  const onSubmit: SubmitHandler<FormDataUpdateAdemic> = async data => {
    const formData = new FormData();

    const universityEmployeeRequest = {
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      gender: data.gender,
      dateOfBirth: formatDateDd_MM_yyyy(data.dateOfBirth),
      phoneNumber: data.phoneNumber,

      address: {
        houseNumber: data.houseNumber,
        wardId: data.wardId,
      },
    };

    formData.append('universityEmployeeRequest', new Blob([JSON.stringify(universityEmployeeRequest)], { type: 'application/json' }));
    formData.append('file', image as File);

    if (IdAdemic) {
      try {
        await updateAdemic({ formData, id: IdAdemic }).unwrap();
        toast.success('Sửa giáo vụ thành công');
        router.push('/admin/school/academicOfficeManagement');
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
    if (ademic?.data) {
      reset({
        employeeCode: ademic.data.employeeCode,
        fullName: ademic.data.fullName,
        avatarUrl: ademic.data.avatarUrl,
        gender: ademic.data.gender,
        dateOfBirth: ademic?.data.dateOfBirth ? dayjs(ademic?.data.dateOfBirth, 'DD/MM/YYYY') : null,
        phoneNumber: ademic.data.phoneNumber,
        houseNumber: ademic.data.address.houseNumber,
        email: ademic.data.account.email,
        wardId: ademic.data.address.ward.id,
        provinceId: ademic.data.address.province.id,
        districtId: ademic.data.address.district.id,
      });
    }
    dispatch(setLoading(isLoadingDetailAdemic));
  }, [dispatch, isLoadingDetailAdemic, reset, ademic]);
  useEffect(() => {
    if (ademic?.data.avatarUrl) {
      setImage(ademic?.data.avatarUrl);
    }
  }, [ademic?.data.avatarUrl]);
  return (
    <div className="rounded-lg bg-primary-white p-6">
      <div className="p-5">
        <Link href={'/admin/school/academicOfficeManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Cập nhật giáo vụ </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-5">
          <ImageUploaderOne image={image} setImage={setImage} />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="employeeCode"
              label="Mã nhân viên"
              placeholder="Nhập mã nhân viên"
              control={control}
              error={errors.employeeCode?.message}
              disabled={true}
              required={true}
            />
            <Input
              type="text"
              name="fullName"
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              control={control}
              error={errors.fullName?.message}
              required={true}
            />

            <SelectReact
              name="gender"
              label="Giới tính"
              placeholder="Chọn giới tính"
              options={gender.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              control={control}
              error={errors.gender?.message}
              required={true}
            />
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
              required={true}
            />
          </div>
          <FormProvider {...methods}>
            <Address
              control={methods.control}
              districtName="districtId"
              provinceName="provinceId"
              wardName="wardId"
              errorDistrict={errors.districtId?.message}
              errorProvince={errors.provinceId?.message}
              errorWard={errors.wardId?.message}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateComponent
                name="dateOfBirth"
                control={control}
                error={errors.dateOfBirth?.message}
                placeholder={'Nhập ngày sinh'}
                label={'Ngày sinh'}
                required={true}
              />
            </Address>
          </FormProvider>
        </div>{' '}
        <Input
          type="text"
          name="houseNumber"
          label="Số nhà, đường"
          placeholder="Nhập số nhà, đường"
          control={control}
          error={errors.houseNumber?.message}
          required={true}
        />
        <div className="ml-auto mt-5 w-fit ">
          <Button text="Cập nhật" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default UpdateAdemic;
