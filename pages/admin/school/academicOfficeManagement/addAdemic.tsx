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
import { useAddAcademicOfficeManagementMutation, useDeleteAcademicOfficeManagementMutation, useDeleteAdemicOneMutation } from '@/services/adminSchoolApi';
import { useGetAllAccountSchoolQuery, useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
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
    console.log(data, image);

    // Chuyển đổi đối tượng universityEmployeeRequest thành chuỗi JSON và append vào FormData
    formData.append('universityEmployeeRequest', new Blob([JSON.stringify(universityEmployeeRequest)], { type: 'application/json' }));
    // Append file vào FormData
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
    <div className="bg-primary-white p-6">
      <div className="rounded-t-lg">
        <Link href={'/admin/school/academicOfficeManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0 ">
        <div className="mb-5">
          <h1 className="my-10 text-center text-2xl font-bold">Thêm mới giáo vụ</h1>
          <ImageUploaderOne image={image} setImage={setImage} />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              type="text"
              name="employeeCode"
              label="Mã nhân viên"
              placeholder="Nhập mã nhân viên"
              control={control}
              error={errors.employeeCode?.message}
            />
            <Input type="text" name="fullName" label="Họ và tên" placeholder="Nhập họ và tên" control={control} error={errors.fullName?.message} />

            <SelectReact
              name="gender"
              label="Giới tính"
              placeholder="Chọn giới tính"
              options={gender.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              control={control}
            />
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
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

            <Input type="date" name="dateOfBirth" label="Ngày sinh" placeholder="Nhập ngày sinh" control={control} error={errors.dateOfBirth?.message} />
            <div>
              <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
                Tỉnh
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
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={provinces?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                    ref={field.ref}
                  />
                )}
              />
              {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
            </div>
            <div>
              <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
                Huyện
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
                    getOptionLabel={(option: { districtName: any }) => option.districtName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={districts?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                    ref={field.ref}
                  />
                )}
              />
              {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
            </div>
            <div>
              <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
                Xã
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
                    getOptionLabel={(option: { wardName: any }) => option.wardName || ''} // Hiển thị tên tỉnh
                    getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                    onChange={(selectedOption: { id: any }) => {
                      field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                    }}
                    value={wards?.data?.find(option => option.id === Number(field.value))} // Giữ giá trị name (tên tỉnh) khi chọn
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
        <Button text="Thêm" full={true} type="submit" className="mt-5" />
      </form>
    </div>
  );
};

export default AddAdemic;
