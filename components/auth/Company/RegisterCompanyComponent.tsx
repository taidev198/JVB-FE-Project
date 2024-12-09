/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import registerValidate from './validation';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';
const TextEditor = dynamic(() => import('@/components/Common/TextEditor'), { ssr: false });

type FormDataRegisterCompany = {
  company_name: string;
  company_code: string;
  email: string;
  password: string;
  confirm_password: string;
  company_description: string;
  phone_number: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  establish_date: string;
  number_house: string;
  tax_code: string;
};

const RegisterCompanyComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataRegisterCompany>({
    resolver: yupResolver<FormDataRegisterCompany>(registerValidate), //+
    defaultValues: {
      company_description: '',
    },
  });

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  watch('wardId');
  // Fetch data
  const { data: provinces, isLoading } = useGetAllProvincesQuery();
  const { data: districts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  const onSubmit: SubmitHandler<FormDataRegisterCompany> = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0">
      <h1 className="my-10 text-2xl font-bold">Đăng ký tài khoản Doanh nghiệp</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Các trường thông tin khác */}
        <Input name="company_name" label="Tên doanh nghiệp" placeholder="Nhập tên doanh nghiệp" control={control} error={errors.company_name?.message} />
        <Input name="company_code" label="Mã doanh nghiệp" placeholder="Nhập mã doanh nghiệp" control={control} error={errors.company_code?.message} />
        <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
        <Input type="text" name="tax_code" label="Mã số thuế" placeholder="Nhập mã số thuế" control={control} error={errors.tax_code?.message} />
        <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập Mật khẩu" control={control} error={errors.password?.message} />
        <Input
          type="password"
          name="confirm_password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          control={control}
          error={errors.confirm_password?.message}
        />
        <Input type="text" name="phone_number" label="Số điện thoại" placeholder="Nhập số điện thoại" control={control} error={errors.phone_number?.message} />
        <Input type="date" name="establish_date" label="Ngày thành lập" placeholder="" control={control} error={errors.establish_date?.message} />
      </div>

      {/* Chọn tỉnh */}
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
              isLoading={isLoading}
              options={provinces?.data || []}
              getOptionLabel={(option: { provinceName: any }) => option.provinceName || ''} // Hiển thị tên tỉnh
              getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
              }}
              value={provinces?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
            />
          )}
        />
        {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
      </div>

      {/* Chọn Huyện */}
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
              isLoading={isLoading}
              options={districts?.data || []}
              getOptionLabel={(option: { districtName: any }) => option.districtName || ''} // Hiển thị tên tỉnh
              getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
              }}
              value={districts?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
            />
          )}
        />
        {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
      </div>

      {/* Chọn Xã */}
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
              isLoading={isLoading}
              options={wards?.data || []}
              getOptionLabel={(option: { wardName: any }) => option.wardName || ''} // Hiển thị tên tỉnh
              getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
              }}
              value={wards?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
            />
          )}
        />
        {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
      </div>

      {/* Số nhà */}
      <div className="my-4 flex flex-col gap-4">
        <Input type="text" name="number_house" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.number_house?.message} />

        {/* Mô tả */}
        <Controller
          name="company_description"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Mô tả" error={errors.company_description?.message} />
          )}
        />
      </div>
      <Button text="Đăng ký" full={true} type="submit" />
    </form>
  );
};
export default RegisterCompanyComponent;
