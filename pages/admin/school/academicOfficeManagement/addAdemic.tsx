import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import validationSchemaAddAdemic from '../../../../components/Admin/school/Ademic/validationAddAdemic';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { setLoading } from '@/store/slices/global';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Link from 'next/link';
import { gender } from '@/utils/app/const';
import SelectReact from '@/components/Common/SelectMui';
import { useRouter } from 'next/router';
import { setToast } from '@/store/slices/toastSlice';
import { useAddAcademicOfficeManagementMutation, useDeleteAdemicOneMutation } from '@/services/adminSchoolApi';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
import Text from '@/components/Common/Text';
import toast from 'react-hot-toast';

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
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddAdemic>({
    resolver: yupResolver(validationSchemaAddAdemic),
  });

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });
  const [addAcademicOfficeManagement, { data, isLoading: isLoadingAddAcademicOfficeManagement, isSuccess, isError, error }] =
    useAddAcademicOfficeManagementMutation();

  const onSubmit: SubmitHandler<FormDataAddAdemic> = data => {
    const formData = new FormData();

    // Append dữ liệu JSON dưới dạng chuỗi
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
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
    };

    formData.append('universityEmployeeRequest', new Blob([JSON.stringify(universityEmployeeRequest)], { type: 'application/json' }));

    formData.append('file', image as File);
    addAcademicOfficeManagement(formData);
  };

  useEffect(() => {
    if (isSuccess && data?.message) {
      dispatch(setToast({ message: data.message }));
      router.push('/admin/school/academicOfficeManagement');
    }

    if (isError && error?.data?.message) {
      toast.error(error?.data?.message);
    }

    dispatch(setLoading(isLoadingAddAcademicOfficeManagement));
  }, [isSuccess, isError, isLoadingAddAcademicOfficeManagement, data?.message, error?.data?.message, dispatch]);

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
            />

            <Input
              type="date"
              name="dateOfBirth"
              label="Ngày sinh"
              placeholder="Nhập ngày sinh"
              control={control}
              error={errors.dateOfBirth?.message}
              required={true}
            />
            <div>
              <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
                Tỉnh<span className="text-red-600">*</span>
              </label>
              <Controller
                name="provinceId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Tỉnh/Thành phố"
                    isLoading={isLoadingProvinces}
                    options={provinces?.data || []}
                    getOptionLabel={(option: { provinceName: any }) => option.provinceName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={provinces?.data?.find(option => option.id === field.value)}
                    ref={field.ref}
                  />
                )}
              />
              {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
            </div>
            <div>
              <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
                Huyện<span className="text-red-600">*</span>
              </label>
              <Controller
                name="districtId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Quận/Huyện"
                    isLoading={isLoadingDistricts}
                    options={districts?.data || []}
                    getOptionLabel={(option: { districtName: any }) => option.districtName || ''}
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={districts?.data?.find(option => option.id === field.value)}
                    ref={field.ref}
                  />
                )}
              />
              {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
            </div>
            <div>
              <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
                Xã<span className="text-red-600">*</span>
              </label>
              <Controller
                name="wardId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Chọn Xã/Phường"
                    isLoading={isLoadingWard}
                    options={wards?.data || []}
                    getOptionLabel={(option: { wardName: any }) => option.wardName || ''}
                    getOptionValue={(option: { id: any }) => option.id}
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null);
                    }}
                    value={wards?.data?.find(option => option.id === Number(field.value))}
                    ref={field.ref}
                  />
                )}
              />
              {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
            </div>
          </div>
          <div className="mt-5">
            <Text
              type="text"
              name="houseNumber"
              label="Địa chỉ cụ thể"
              placeholder="Nhập địa chỉ cụ thể"
              control={control}
              error={errors.houseNumber?.message}
            />
          </div>
        </div>
        <div className="ml-auto w-fit ">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default AddAdemic;
