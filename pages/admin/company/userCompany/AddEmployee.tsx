import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import addWorkshopSchema from '@/validation/companyEmployee/validationAddEmployee';
import Input from '@/components/Common/Input';
import SelectMui from '@/components/Common/SelectMui';
import Select from '@/components/Common/Select';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';

interface FormDataWorkShop {
    employee_code: string;
    full_name: string;
    phone_number: string;
    email: string;
    gender: string;
    employee_position: string;
    salary: number;
    status_account: string;
    wardName: number;
    districtName: number;
    provinceName: number;
    houseNumber: string;
    // fieldIds: number[];
    data_of_birth: Date;
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
  } = useForm<FormDataWorkShop>({
    resolver: yupResolver(addWorkshopSchema),
  });

  const onSubmit: SubmitHandler<FormDataWorkShop> = data => {
    ({ data, image });
  };
  return (
    <div className="">
    {/* Icon */}
    <div className="rounded-t-lg bg-white p-5">
      <Link href={'/admin/company/userCompany'}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      Trở về
      <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm mới Nhân Viên </h1>
    </div>

      {/* Block 2 */}
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-primary-white ">
        {/* Image */}
        <ImageUploaderOne images={image} setImages={setImage} />
      </div>

    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Block 1 */}
      <div className="rounded-b-lg bg-primary-white p-5">
        <Input name="employee_code" control={control} error={errors.employee_code?.message} placeholder="Mã nhân viên" label="Mã nhân viên" />
        <div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/*  */}
            <Input 
              name="full_name" 
              control={control} 
              error={errors.full_name?.message} 
              placeholder="Tên nhân viên" 
              label="Tên nhân viên" />
            {/*  */}
            
            <Input 
              type='date'
              name="data_of_birth" 
              control={control} 
              error={errors.data_of_birth?.message} 
              placeholder="Ngày sinh" 
              label="Ngày sinh" />

            <Input
              // type="number"
              name="phone_number"
              label="Số điện thoại"
              placeholder="Số điện thoại"
              control={control}
              error={errors.phone_number?.message}
            />
            <Input
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

            <Input
              name="employee_position"
              label="Vị trí công việc"
              placeholder="vị trí công việc"
              control={control}
              error={errors.employee_position?.message}
            />
            <Input
              type='number'
              name="salary"
              label="Mức lương"
              placeholder="mức lương"
              control={control}
              error={errors.salary?.message}
            />
              <SelectMui
                name="status_account"
                label="Trạng thái"
                control={control}
                options={[
                  { value: 1, label: 'Đang làm' },
                  { value: 2, label: 'Nghỉ việc' },
                ]}
                isMultiple={true} // Bật chế độ chọn nhiều
                error={errors.status_account?.message}
              />

            <Input
              name="password"
              label="Mật khẩu"
              placeholder="Mật khẩu"
              control={control}
              error={errors.password?.message}
            />   
            <Input
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu"
              control={control}
              error={errors.confirmPassword?.message}
            />   

          </div>

        </div>
      </div>

      {/* Block 3 */}

      {/* Block 4 */}
      <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-primary-white p-5 sm:grid-cols-2">
        {/* Address */}
        <Select
          name="provinceName"
          label="Tỉnh/ Thành phố"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '1', label: 'Health' },
            { value: '2', label: 'Finance' },
          ]}
          error={errors.provinceName?.message}
        />
        <Select
          name="districtName"
          label="Quận/ Huyện"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '1', label: 'Health' },
            { value: '2', label: 'Finance' },
          ]}
          error={errors.districtName?.message}
        />
        <Select
          name="wardName"
          label="Xã/ Phường"
          control={control}
          options={[
            { value: '0', label: 'Chọn' },
            { value: '3', label: 'Health' },
            { value: '4', label: 'Finance' },
          ]}
          error={errors.wardName?.message}
        />
        <Input type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà" control={control} error={errors.houseNumber?.message} />
      </div>
      <div className="flex justify-end bg-primary-white p-5">
        <Button text="Thêm mới" type="submit" />
      </div>
    </form>
  </div>
  )
}

export default AddEmployee