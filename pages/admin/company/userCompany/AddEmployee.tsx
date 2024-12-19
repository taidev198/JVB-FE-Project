import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import SelectMui from '@/components/Common/SelectMui';
import Select from '@/components/Common/Select';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import Text from '@/components/Common/Text';
import validationSchemaAddStudent from '@/validation/companyEmployee/validationAddEmployee';

interface FormDataAddEmployee {
    employeeCode: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    employeePosition: string;
    salary: number;
    employeeStatus: string;
    wardName: number;
    districtName: number;
    provinceName: number;
    houseNumber: string;
    // fieldIds: number[];
    dateOfBirth: Date;
    password: string;
    confirmPassword: string;
    // address: string;
  }

const AddEmployee = () => {
    const [image, setImage] = useState<File[]>([]);
    const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataAddEmployee>({
    resolver: yupResolver(validationSchemaAddStudent),
  });

  const onSubmit: SubmitHandler<FormDataAddEmployee> = data => {
    ({ data, image });
  };
  return (
    <div className="bg-primary-white px-10">
    {/* Icon */}
    <div className="rounded-t-lg ">
      <Link href={'/admin/company/userCompany'}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      Trở về
      <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm Nhân Viên </h1>
    </div>
    <form onSubmit={handleSubmit(onSubmit)} className=''>
      <div className=''>
         {/* Image */}
         <ImageUploaderOne images={image} setImages={setImage} />
        {/* Block 1 */}
      <div className="rounded-b-lg mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* employee code */}
            <Input 
              name="employeeCode" 
              control={control} 
              error={errors.employeeCode?.message} 
              placeholder="Mã nhân viên" 
              label="Mã nhân viên" />
        
        {/* employee name */}
            <Input 
              name="fullName" 
              control={control} 
              error={errors.fullName?.message} 
              placeholder="Tên nhân viên" 
              label="Tên nhân viên" />
           
         {/* dateofbirthday */}    
            <Input 
              type='date'
              name="dateOfBirth" 
              control={control} 
              error={errors.dateOfBirth?.message} 
              placeholder="Ngày sinh" 
              label="Ngày sinh" />

         {/* phonenumber */}
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
            />

          {/* email */}
            <Input
              type='email'
              name="email"
              label="Email"
              placeholder="email"
              control={control}
              error={errors.email?.message}
            />

          {/* Trường giới tính */}
          <Input
              name="gender"
              label="Giới tính"
              placeholder="gender"
              control={control}
              error={errors.gender?.message}
            />

          {/* vị trí công việc */}
            <Input
              name="employeePosition"
              label="Vị trí công việc"
              placeholder="vị trí công việc"
              control={control}
              error={errors.employeePosition?.message}
            />

          {/* lương */}
            <Input
              type='number'
              name="salary"
              label="Mức lương"
              placeholder="mức lương"
              control={control}
              error={errors.salary?.message}
            />

          {/* Trạng thái */}
              <SelectMui
                name="employeeStatus"
                placeholder='Nhập trạng thái'
                label="Trạng thái"
                control={control}
                options={[
                  { value: 1, label: 'Đang làm' },
                  { value: 2, label: 'Nghỉ việc' },
                ]}
                isMultiple={true} // Bật chế độ chọn nhiều
                error={errors.employeeStatus?.message}
              />

            {/* mật khẩu */}
            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Mật khẩu"
              control={control}
              error={errors.password?.message}
            />  

             {/*mật khẩu */}
            <Input
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              control={control}
              error={errors.confirmPassword?.message}
            />  

            {/* Address */}
            <div>
              <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
                Tỉnh
              </label>
                
              <Select
               name="provinceName"
               control={control}
               options={[
                { value: '0', label: 'Chọn' },
                { value: '1', label: 'Health' },
                { value: '2', label: 'Finance' },
                ]}
              error={errors.provinceName?.message}
              />
            </div>

            {/* Chọn Huyện */}
            <div>
            <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
                Huyện
            </label>
            <Select
              name="districtName"
              control={control}
              options={[
                { value: '0', label: 'Chọn' },
                { value: '1', label: 'Health' },
                { value: '2', label: 'Finance' },
              ]}
              error={errors.districtName?.message}
            />
            </div>

            {/* Chọn xã */}
            <div>
            <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
                Xã
            </label>
            <Select
              name="wardName"
              control={control}
              options={[
                { value: '0', label: 'Chọn' },
                { value: '3', label: 'Health' },
                { value: '4', label: 'Finance' },
              ]}
              error={errors.wardName?.message}
            />
            </div>
      </div>
      <Text type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.houseNumber?.message} />
      </div>
  
      <div className="ml-auto w-fit py-5">
        <Button text="Thêm mới" type="submit" />
      </div>
    </form>
  </div>
  )
}

export default AddEmployee