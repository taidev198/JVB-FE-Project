/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import registerValidateCompany from './validation';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import TextEditor from '@/components/Common/TextEditor';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery, useRegisterCompanyMutation } from '@/services/adminSystemApi';
import { setLoading } from '@/store/slices/global';
import { setToast } from '@/store/slices/toastSlice';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';

interface FormDataRegisterSchool {
  companyName: string;
  companyCode: string;
  companyDescription: string;
  phoneNumber: string;
  houseNumber: string;
  wardId: number;
  email: string;
  password: string;
  confirm_password: string;
  districtId: number;
  provinceId: number;
  establishDate: string;
  taxCode: string;
}

const RegisterCompanyComponent = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataRegisterSchool>({
    resolver: yupResolver(registerValidateCompany),
  });

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');
  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });
  watch('wardId');
  const [registerSchool, { data, isLoading: isLoadingRegister, isSuccess, isError, error }] = useRegisterCompanyMutation();
  const onSubmit: SubmitHandler<FormDataRegisterSchool> = data => {
    const { confirm_password, provinceId, districtId, establishDate, ...payload } = data;
    const formattedDate = formatDateDd_MM_yyyy(establishDate);
    registerSchool({ ...payload, establishDate: formattedDate });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data.message }));
    }
    if (isError) {
      const errorMessages = error?.data?.data;

      if (errorMessages && typeof errorMessages === 'object') {
        // Lấy danh sách các lỗi, loại bỏ giá trị `null` hoặc `undefined`
        const allErrors = Object.values(errorMessages).filter(msg => Boolean(msg));

        // Hiển thị lỗi đầu tiên nếu có
        if (allErrors.length > 0) {
          dispatch(setToast({ message: allErrors[0], type: 'error' }));
        }
      } else if (error?.data?.message) {
        // Trường hợp lỗi chỉ có 1 message thay vì object
        dispatch(setToast({ message: error.data.message, type: 'error' }));
      } else {
        // Lỗi mặc định
        dispatch(setToast({ message: 'Đã xảy ra lỗi, vui lòng thử lại.', type: 'error' }));
      }
    }

    dispatch(setLoading(isLoadingDistricts || isLoadingProvinces || isLoadingWard || isLoadingRegister));
  }, [dispatch, isLoadingDistricts, isLoadingProvinces, isLoadingWard, isLoadingRegister, data?.success, isSuccess]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5 sm:px-0">
      <h1 className="my-10 text-2xl font-bold">Đăng ký tài khoản Doanh nghiệp</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name school */}
        <>
          <Input name="companyName" label="Tên doanh nghiệp" placeholder="Nhập tên doanh nghiệp" control={control} error={errors.companyName?.message} />
        </>
        {/* Code school */}
        <>
          <Input name="companyCode" label="Mã doanh nghiệp" placeholder="Nhập mã doanh nghiệp" control={control} error={errors.companyCode?.message} />
        </>
        {/* Code school */}
        <>
          <Input name="taxCode" label="Mã số thuế" placeholder="Nhập mã số thuế" control={control} error={errors.taxCode?.message} />
        </>
        {/* Email */}
        <>
          <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} />
        </>
        {/* Password */}
        <>
          <Input type="password" name="password" label="Mật khẩu" placeholder="Nhập Mật khẩu" control={control} error={errors.password?.message} />
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
          />
        </>
        {/* Phone */}
        <>
          <Input type="text" name="phoneNumber" label="Số điện thoại" placeholder="Nhập số điện thoại" control={control} error={errors.phoneNumber?.message} />
        </>
        {/* Establihed date */}
        <>
          <Input type="date" name="establishDate" label="Ngày thành lập" placeholder="" control={control} error={errors.establishDate?.message} />
        </>
      </div>
      {/* Địa chỉ */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="Chọn Xã/Phường"
                isLoading={isLoadingWard}
                options={wards?.data || []}
                getOptionLabel={(option: { wardName: any }) => option.wardName || ''} // Hiển thị tên tỉnh
                getOptionValue={(option: { id: any }) => option.id} // Chỉ lưu id
                onChange={(selectedOption: { id: any }) => {
                  field.onChange(selectedOption ? selectedOption.id : null); // Lưu id vào form
                }}
                value={wards?.data?.find(option => option.id === field.value)} // Giữ giá trị name (tên tỉnh) khi chọn
                ref={field.ref}
              />
            )}
          />
          {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
        </div>
        <div>
          <Input type="text" name="houseNumber" label="Số nhà, đường" placeholder="Nhập số nhà, đường" control={control} error={errors.houseNumber?.message} />
        </div>
      </div>
      {/* Number house */}
      <div className="mt-4 flex flex-col gap-4">
        {/* Description */}
        <>
          <Controller
            name="companyDescription"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Mô tả chi tiết"
                error={errors.companyDescription?.message}
              />
            )}
          />
        </>
      </div>
      <Button text="Đăng ký" full={true} type="submit" />
    </form>
  );
};
export default RegisterCompanyComponent;
