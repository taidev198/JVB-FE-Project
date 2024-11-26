/* eslint-disable no-console */
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Select from '../../Common/Select';
import Text from '../../Common/Text';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import validationSchema from '@/components/auth/Company/validation';

interface FormDataRegisterCompany {
  company_name: string;
  company_code: string;
  email: string;
  password: string;
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
  });

  const onSubmit: SubmitHandler<FormDataRegisterCompany> = data => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[550px]">
      <h1 className="my-10 text-2xl font-bold">Đăng ký tài khoản Doanh nghiệp</h1>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        {/* Name company */}
        <>
          <Input name="company_name" label="Tên doanh nghiệp" placeholder="Nhập tên doanh nghiệp" control={control} error={errors.company_name?.message} />
        </>
        {/* Code company */}
        <>
          <Input name="company_code" label="Mã doanh nghiệp" placeholder="Nhập mã doanh nghiệp" control={control} error={errors.company_code?.message} />
        </>
        {/* Email */}
        <>
          <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
        </>
        {/* Tax code */}
        <>
          <Input type="text" name="tax_code" label="Mã số thuế" placeholder="Nhập mã số thuế" control={control} error={errors.tax_code?.message} />
        </>
        {/* Password */}
        <>
          <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập Mật khẩu" control={control} error={errors.password?.message} />
        </>
        {/* Confirm password */}
        <>
          <Input type="password" name="repassword" label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu" control={control} />
        </>
        {/* Phone */}
        <>
          <Input
            type="text"
            name="phone_number"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            control={control}
            error={errors.phone_number?.message}
          />
        </>
        {/* Establihed date */}
        <>
          <Input type="date" name="establihed_date" label="Ngày thành lập" placeholder="" control={control} error={errors.establish_date?.message} />
        </>
      </div>
      {/* Địa chỉ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <>
          <Select
            name="province_id"
            label="Tỉnh/ Thành phố"
            control={control}
            options={[
              { value: 'technology', label: 'Chọn' },
              { value: 'health', label: 'Health' },
              { value: 'finance', label: 'Finance' },
            ]}
            error={errors.province_id?.message}
          />
        </>
        <>
          <Select
            name="district_id"
            label="Quận/ Huyện"
            control={control}
            options={[
              { value: 'technology', label: 'Chọn' },
              { value: 'health', label: 'Health' },
              { value: 'finance', label: 'Finance' },
            ]}
            error={errors.district_id?.message}
          />
        </>
        <>
          <Select
            name="ward_id"
            label="Xã/ Phường"
            control={control}
            options={[
              { value: 'technology', label: 'Chọn' },
              { value: 'health', label: 'Health' },
              { value: 'finance', label: 'Finance' },
            ]}
            error={errors.ward_id?.message}
          />
        </>
      </div>
      {/* Number house */}
      <>
        <Input type="text" name="number_house" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.number_house?.message} />
      </>
      {/* Description */}
      <>
        <Text name="company_description" label="Mô tả" placeholder="Nhập mô tả..." control={control} error={errors.company_description?.message} />
      </>
      <Button text="Đăng ký" full={true} type="submit" />
    </form>
  );
};
export default RegisterCompanyComponent;
