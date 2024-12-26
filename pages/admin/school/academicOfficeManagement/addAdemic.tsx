import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import validationSchemaAddAdemic from '../../../../components/Admin/school/Ademic/validationAddAdemic';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { setLoading } from '@/store/slices/global';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import { gender } from '@/utils/app/const';
import SelectReact from '@/components/Common/SelectMui';
import { useAddAcademicOfficeManagementMutation } from '@/services/adminSchoolApi';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';

interface FormDataAddAdemic {
  fullName: string;
  employeeCode: string;
  password: string;
  confirm_password: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  gender: string;
  email: string;
  avatarUrl: string;
  wardId: string;
  houseNumber: string;
  provinceId: number;
  districtId: number;
}

const AddAdemic = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const methods = useForm<FormDataAddAdemic>({
    resolver: yupResolver(validationSchemaAddAdemic),
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
    formState: { errors },
  } = methods;

  const [addAcademicOfficeManagement, { data, isLoading: isLoadingAddAcademicOfficeManagement, isSuccess, isError, error }] =
    useAddAcademicOfficeManagementMutation();

  const onSubmit: SubmitHandler<FormDataAddAdemic> = async data => {
    const formData = new FormData();
    const universityEmployeeRequest = {
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      account: {
        email: data.email,
        password: data.password,
      },
      address: {
        houseNumber: data.houseNumber,
        wardId: data.wardId,
      },
      gender: data.gender,
      dateOfBirth: formatDateDd_MM_yyyy(data.dateOfBirth),
      phoneNumber: data.phoneNumber,
    };

    formData.append('universityEmployeeRequest', new Blob([JSON.stringify(universityEmployeeRequest)], { type: 'application/json' }));
    formData.append('file', image as File);
    try {
      await addAcademicOfficeManagement(formData).unwrap();
      toast.success('Thêm giáo vụ thành công');
      router.push('/admin/school/academicOfficeManagement');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoadingAddAcademicOfficeManagement));
  }, [isLoadingAddAcademicOfficeManagement, dispatch]);

  return (
    <div className="rounded-lg bg-primary-white p-6">
      <div className="p-5">
        <Link href={'/admin/school/academicOfficeManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm giáo vụ </h1>
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
              required={true}
              error={errors.gender?.message}
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
            <Input type="text" name="email" label="Email" placeholder="Nhập email" control={control} error={errors.email?.message} required={true} />
            <Input
              type="password"
              name="password"
              label="Mật khẩu"
              placeholder="Nhập Mật khẩu"
              control={control}
              error={errors.password?.message}
              required={true}
            />
            <Input
              type="password"
              name="confirm_password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              control={control}
              error={errors.confirm_password?.message}
              required={true}
            />

            <DateComponent
              name="dateOfBirth"
              control={control}
              error={errors.dateOfBirth?.message}
              placeholder={'Nhập ngày sinh'}
              label={'Ngày sinh'}
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
              <Input
                type="text"
                name="houseNumber"
                label="Số nhà, đường"
                placeholder="Nhập số nhà, đường"
                control={control}
                error={errors.houseNumber?.message}
                required={true}
              />
            </Address>
          </FormProvider>
        </div>
        <div className="ml-auto w-fit ">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddAdemic;
