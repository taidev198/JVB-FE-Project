import { IconButton } from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import ImageUploaderOne from '@/components/Common/ImageUploaderOne';
import validationSchemaAddStudent from '@/validation/companyEmployee/employee/validationAddEmployee';
import SelectReact from '@/components/Common/SelectMui';
import { gender } from '@/utils/app/const';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';
import { useRouter } from 'next/router';
import { useAddEmployeeMutation } from '@/services/adminCompanyApi';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';

interface FormDataAddEmployee {
  employeeCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  employeePosition: string;
  salary: number;
  wardId: number;
  districtId: number;
  provinceId: number;
  houseNumber: string;
  dateOfBirth: Date;
  password: string;
  confirmPassword: string;
}

const AddEmployee = () => {
  const [image, setImage] = useState<File | string | null>(null);
  const router = useRouter();
  const methods = useForm<FormDataAddEmployee>({
    resolver: yupResolver(validationSchemaAddStudent),
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

  console.log('errors: ', errors)

  const [addEmployee, { isLoading }] = useAddEmployeeMutation();

  const onSubmit: SubmitHandler<FormDataAddEmployee> = async data => {
    // console.log({ data, image });
    const formData = new FormData();

    const companyEmployeeRequest = {
      employeeCode: data.employeeCode,
      account: {
        email: data.email,
        password: data.password
      },
     phoneNumber: data.phoneNumber,
     fullName: data.fullName,
     address: {
       houseNumber: data.houseNumber,
       wardId: data.wardId
      },
     employeePosition: data.employeePosition,
     dateOfBirth: formatDateDd_MM_yyyy(data.dateOfBirth),
     gender: data.gender,
     salary: data.salary
    }

    // Chuyển đổi đối tượng studentRequest thành chuỗi JSON và append vào FormData
    formData.append('companyEmployeeRequest', new Blob([JSON.stringify(companyEmployeeRequest)], { type: 'application/json' }));
    // Append file vào FormData
    formData.append('file', image as File);
    try {
      const response = await addEmployee(formData).unwrap();
      toast.success(response.messages);
      router.push('/admin/company/userCompany');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="rounded-lg bg-primary-white p-5">
      {/* Icon */}
      <div className="">
        <Link href={'/admin/company/userCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thêm nhân viên </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="">
          {/* Image */}
          <div className="mx-5">
            <ImageUploaderOne image={image} setImage={setImage} />
          </div>
          {/* Block 1 */}
          <div className="mt-8 grid grid-cols-1 gap-4 rounded-b-lg sm:grid-cols-2">
            {/* employee code */}
            <Input name="employeeCode" control={control} error={errors.employeeCode?.message} placeholder="Mã nhân viên" label="Mã nhân viên" required={true} />

            {/* employee name */}
            <Input name="fullName" control={control} error={errors.fullName?.message} placeholder="Tên nhân viên" label="Tên nhân viên" required={true} />

            {/* dateofbirthday */}
            <DateComponent
              name="dateOfBirth"
              control={control}
              error={errors.dateOfBirth?.message}
              placeholder="Ngày sinh"
              label="Ngày sinh"
              required={true}
            />

            {/* phonenumber */}
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              required={true}
              placeholder="Số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
            />

            {/* email */}
            <Input type="email" name="email" label="Email" placeholder="email" required={true} control={control} error={errors.email?.message} />

            {/* Trường giới tính */}
            <SelectReact
              name="gender"
              label="Giới tính"
              placeholder="Chọn giới tính"
              options={gender.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              control={control}
              error={errors.gender?.message}
              required={true}
            />

            {/* vị trí công việc */}
            <Input
              name="employeePosition"
              label="Vị trí công việc"
              required={true}
              placeholder="vị trí công việc"
              control={control}
              error={errors.employeePosition?.message}
            />

            {/* lương */}
            <Input type="number" name="salary" label="Mức lương" required={true} placeholder="mức lương" control={control} error={errors.salary?.message} />

            {/* mật khẩu */}
            <Input type="password" name="password" label="Mật khẩu" required={true} placeholder="Mật khẩu" control={control} error={errors.password?.message} />

            {/*mật khẩu */}
            <Input
              type="password"
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              required={true}
              placeholder="Nhập lại mật khẩu"
              control={control}
              error={errors.confirmPassword?.message}
            />
          </div>
          {/* Address */}
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
        <div className="ml-auto w-fit py-5">
          <Button text="Thêm mới" type="submit" />
        </div>
      </form>
    </div>
  );
}
export default AddEmployee;
