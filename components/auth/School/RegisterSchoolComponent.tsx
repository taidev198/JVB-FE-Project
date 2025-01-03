import { useForm, SubmitHandler, Controller, FormProvider, Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import validationSchemaSchool, { FormDataRegisterSchool } from './validationSchemaSchool';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import TextEditor from '@/components/Common/TextEditor';
import { useRegisterUniversityMutation } from '@/services/adminSystemApi';
import SelectReact from '@/components/Common/SelectMui';
import { typeUniversity } from '@/utils/app/const';
import { setLoading } from '@/store/slices/global';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import Address from '@/components/Common/Address';
import DateComponent from '@/components/Common/DateComponent';

const RegisterSchoolComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const methods = useForm<FormDataRegisterSchool>({
    resolver: yupResolver(validationSchemaSchool) as Resolver<FormDataRegisterSchool>,
    mode: 'onChange',
    defaultValues: {
      universityName: '',
      universityCode: '',
      email: '',
      password: '',
      confirm_password: '',
      phoneNumber: '',
      wardId: null,
      districtId: null,
      provinceId: null,
      establishDate: '',
      houseNumber: '',
      universityType: '',
      universityDescription: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const [registerSchool, { isLoading: isLoadingRegister }] = useRegisterUniversityMutation();
  const onSubmit: SubmitHandler<FormDataRegisterSchool> = async data => {
    const { establishDate, ...payload } = data;
    const formattedDate = formatDateDd_MM_yyyy(establishDate);
    try {
      const response = await registerSchool({ ...payload, establishDate: formattedDate }).unwrap();
      await toast.success(response?.message);
      router.push('/');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoadingRegister));
  }, [dispatch, isLoadingRegister]);
  return (
    <>
      <h1 className="my-6 px-6 text-xl font-bold md:mx-5 md:px-0 md:text-2xl">Đăng ký tài khoản trường học</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-md border p-6 shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name school */}
          <>
            <Input
              name="universityName"
              label="Tên trường học"
              placeholder="Nhập tên trường học"
              control={control}
              error={errors.universityName?.message}
              required={true}
            />
          </>
          {/* Code school */}
          <>
            <Input
              name="universityCode"
              label="Mã trường"
              placeholder="Nhập mã trường"
              control={control}
              error={errors.universityCode?.message}
              required={true}
            />
          </>
          {/* Email */}
          <>
            <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} required={true} />
          </>
          {/* Type school */}
          <>
            <SelectReact
              name="universityType"
              label="Loại trường"
              placeholder="Chọn lĩnh vực"
              options={(typeUniversity || []).map(type => ({
                value: type.value,
                label: type.label,
              }))}
              control={control}
              error={errors.universityType?.message}
              required={true}
            />
          </>
          {/* Password */}
          <>
            <Input
              type="password"
              name="password"
              label="Mật khẩu"
              placeholder="Nhập Mật khẩu"
              control={control}
              error={errors.password?.message}
              required={true}
            />
          </>
          {/*Confirm Password */}
          <>
            <Input
              type="password"
              name="confirm_password"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              control={control}
              error={errors.confirm_password?.message}
              required={true}
            />
          </>
          {/* Phone */}
          <>
            <Input
              type="text"
              name="phoneNumber"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              control={control}
              error={errors.phoneNumber?.message}
              required={true}
            />
          </>
          {/* Establihed date */}
          <DateComponent
            name="establishDate"
            control={control}
            error={errors.establishDate?.message}
            placeholder={'Nhập ngày thành lập'}
            label={'Ngày thành lập'}
            required={true}
          />
        </div>
        {/* Address  */}
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
        <div className="mt-4"></div>
        {/* Number house */}
        <div className="mt-4 flex flex-col">
          {/* Description */}
          <>
            <Controller
              name="universityDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextEditor
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Mô tả chi tiết"
                  error={errors.universityDescription?.message}
                  required={true}
                />
              )}
            />
          </>
        </div>
        <Button text="Đăng ký" full={true} type="submit" className="mt-5" />
      </form>
    </>
  );
};
export default RegisterSchoolComponent;
