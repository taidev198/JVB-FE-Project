import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import addWorkshopSchema from '@/validation/companyEmployee/validationAddEmployee';
import Input from '@/components/Common/Input';
import Select from '@/components/Common/Select';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';

interface FormDataProfile {
    companyCode: string;
    companyName: string;
    phoneNumber: string;
    linkWebsite: string;
    establishedDate: string;
    email: string;
    logoUrl: string;
    wardName: number;
    districtName: number;
    provinceName: number;
    houseNumber: string;
    fieldIds: number[];
    // address: string;
  }
const AddProfileCompany = () => {
    const [image, setImage] = useState<File[]>([]);
    const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProfile>({
    resolver: yupResolver(addWorkshopSchema),
  });

  const onSubmit: SubmitHandler<FormDataProfile> = data => {
    ({ data, image });
  };

  return (
    <div className="">
    {/* Icon */}
    <div className="rounded-t-lg bg-white p-5">
      <Link href={'/admin/company/profileCompany'}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      Trở về
      <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm Công Ty </h1>
    </div>

      {/* Block 2 */}
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-primary-white ">
        {/* Image */}
        <ImageUploaderOne images={image} setImages={setImage} />
      </div>

    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Block 1 */}
      <div className="rounded-b-lg bg-primary-white p-5">
        <div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input 
              name="companyCode" 
              control={control} 
              error={errors.companyCode?.message} 
              placeholder="Mã công ty" 
              label="Mã công ty" 
            />

            {/*  */}
            <Input 
              name="companyName" 
              control={control} 
              error={errors.companyName?.message} 
              placeholder="Tên công ty" 
              label="Tên công ty" />
            {/*  */}

            <Input
              // type="number"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
            />
            <Input
              name="linkWebsite"
              label="linkWeb"
              placeholder="linkWebsite"
              control={control}
              error={errors.linkWebsite?.message}
            />

            <Input
              name="email"
              label="email"
              placeholder="email"
              control={control}
              error={errors.email?.message}
            /> 

            <Input
              name="logoUrl"
              label="logoUrl"
              placeholder="logoUrl"
              control={control}
              error={errors.logoUrl?.message}
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

export default AddProfileCompany