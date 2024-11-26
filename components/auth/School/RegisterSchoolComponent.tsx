/* eslint-disable no-console */
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchemaSchool from './validationSchemaSchool';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import Text from '@/components/Common/Text';

interface FormDataRegisterSchool {
  university_name: string;
  university_code: string;
  email: string;
  password: string;
  university_description: string;
  phone_number: string;
  ward_id: number;
  district_id: number;
  province_id: number;
  establish_date: string;
  number_house: string;
  type_university: string;
}

const RegisterSchoolComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterSchool>({
    resolver: yupResolver(validationSchemaSchool),
  });

  const onSubmit: SubmitHandler<FormDataRegisterSchool> = data => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[550px]">
      <h1 className="my-10 text-2xl font-bold">Đăng ký tài khoản Trường học</h1>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        {/* Name school */}
        <>
          <Input name="university_name" label="Tên trường học" placeholder="Nhập tên trường học" control={control} error={errors.university_name?.message} />
        </>
        {/* Code school */}
        <>
          <Input name="university_code" label="Mã trường" placeholder="Nhập mã trường" control={control} error={errors.university_code?.message} />
        </>
        {/* Email */}
        <>
          <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
        </>
        {/* Type school */}
        <>
          <Select
            name="type_university"
            label="Loại trường"
            control={control}
            options={[
              { value: 'technology', label: 'Chọn loại trường' },
              { value: 'UNIVERSITY', label: 'Đại học' },
              { value: 'ACADEMY', label: 'Học viện' },
              { value: 'COLLEGE', label: 'Cao đẳng' },
            ]}
            error={errors.type_university?.message}
          />
        </>
        {/* Password */}
        <>
          <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập Mật khẩu" control={control} error={errors.password?.message} />
        </>
        {/*Confirm Password */}
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
              { value: 'technology', label: 'chọn' },
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
              { value: 'technology', label: 'chọn' },
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
              { value: 'technology', label: 'chọn' },
              { value: 'health', label: 'Health' },
              { value: 'finance', label: 'Finance' },
            ]}
            error={errors.ward_id?.message}
          />
        </>
      </div>
      {/* Number house */}
      <>
        <Input type="text" name="number_house" label="Số nhà, đường" placeholder="Nhập số nhà, đường" control={control} error={errors.number_house?.message} />
      </>
      {/* Description */}
      <>
        <Text name="university_description" label="Mô tả" placeholder="Nhập mô tả..." control={control} error={errors.university_description?.message} />
      </>
      <Button text="Đăng ký" full={true} type="submit" />
    </form>
  );
};
export default RegisterSchoolComponent;
