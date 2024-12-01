import dynamic from 'next/dynamic';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Select from '../../Common/Select';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import validationSchema from '@/components/auth/Company/validation';
const TextEditor = dynamic(() => import('@/components/Common/TextEditor'), { ssr: false });

interface FormDataRegisterCompany {
  company_name: string;
  company_code: string;
  email: string;
  password: string;
  confirm_password: string;
  company_description: string;
  phone_number: string;
  ward_id: number;
  district_id: number;
  province_id: number;
  establish_date: string;
  number_house: string;
  tax_code: string;
}

const RegisterCompanyComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterCompany>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      company_description: '',
    },
  });

  const onSubmit: SubmitHandler<FormDataRegisterCompany> = () => {
    // const { confirm_password, ...payload } = data;
    // console.log({ payload });
  };

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
      {/* Địa chỉ */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          name="province_id"
          label="Tỉnh/ Thành phố"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '1', label: 'Health' },
            { value: '2', label: 'Finance' },
          ]}
          error={errors.province_id?.message}
        />
        <Select
          name="district_id"
          label="Quận/ Huyện"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '1', label: 'Health' },
            { value: '2', label: 'Finance' },
          ]}
          error={errors.district_id?.message}
        />
        <Select
          name="ward_id"
          label="Xã/ Phường"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '3', label: 'Health' },
            { value: '4', label: 'Finance' },
          ]}
          error={errors.ward_id?.message}
        />
      </div>
      {/* Số nhà */}
      <div className="my-4 flex flex-col gap-4">
        <Input type="text" name="number_house" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.number_house?.message} />
        {/* Mô tả */}
        <>
          <Controller
            name="company_description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor value={field.value} onChange={field.onChange} onBlur={field.onBlur} label="Mô tả" error={errors.company_description?.message} />
            )}
          />
        </>
      </div>
      <Button text="Đăng ký" full={true} type="submit" />
    </form>
  );
};
export default RegisterCompanyComponent;
