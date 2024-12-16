/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import registerValidateCompany, { FormDataRegisterSchool } from './validation';
import { Button } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import TextEditor from '@/components/Common/TextEditor';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery, useRegisterCompanyMutation } from '@/services/adminSystemApi';
import { setLoading } from '@/store/slices/global';
import { formatDateDd_MM_yyyy } from '@/utils/app/format';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

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

  const [registerSchool, { data, isLoading: isLoadingRegister, isSuccess }] = useRegisterCompanyMutation();
  const onSubmit: SubmitHandler<FormDataRegisterSchool> = async data => {
    const { confirm_password, provinceId, districtId, establishDate, ...payload } = data;
    const formattedDate = formatDateDd_MM_yyyy(establishDate);
    try {
      const response = await registerSchool({ ...payload, establishDate: formattedDate }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string }).message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoadingDistricts || isLoadingProvinces || isLoadingWard || isLoadingRegister));
  }, [dispatch, isLoadingDistricts, isLoadingProvinces, isLoadingWard, isLoadingRegister]);
  return (
    <>
      <h1 className="my-6 px-6 text-xl font-bold md:mx-5 md:px-0 md:text-2xl">Đăng ký tài khoản doanh nghiệp</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-md border p-6 shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name school */}
          <>
            <Input
              name="companyName"
              label="Tên doanh nghiệp"
              placeholder="Nhập tên doanh nghiệp"
              control={control}
              error={errors.companyName?.message}
              required={true}
            />
          </>
          {/* Code school */}
          <>
            <Input
              name="companyCode"
              label="Mã doanh nghiệp"
              placeholder="Nhập mã doanh nghiệp"
              control={control}
              error={errors.companyCode?.message}
              required={true}
            />
          </>
          {/* Code school */}
          <>
            <Input name="taxCode" label="Mã số thuế" placeholder="Nhập mã số thuế" control={control} error={errors.taxCode?.message} required={true} />
          </>
          {/* Email */}
          <>
            <Input name="email" label="Email" placeholder="Nhập Email" control={control} error={errors.email?.message} required={true} />
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
          <>
            <Input
              type="date"
              name="establishDate"
              label="Ngày thành lập"
              placeholder=""
              control={control}
              error={errors.establishDate?.message}
              required={true}
            />
          </>
        </div>
        {/* Địa chỉ */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
              Tỉnh <span className="text-red-600">*</span>
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
                  styles={{
                    placeholder: (provided: any) => ({
                      ...provided,
                      fontSize: '14px',
                    }),
                  }}
                />
              )}
            />
            {errors.provinceId && <p className="mt-2 text-sm text-red-500">{errors.provinceId.message}</p>}
          </div>

          {/* Chọn Huyện */}
          <div>
            <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
              Huyện <span className="text-red-600">*</span>
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
                  styles={{
                    placeholder: (provided: any) => ({
                      ...provided,
                      fontSize: '14px',
                    }),
                  }}
                />
              )}
            />
            {errors.districtId && <p className="mt-2 text-sm text-red-500">{errors.districtId.message}</p>}
          </div>

          {/* Chọn Xã */}
          <div>
            <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
              Xã <span className="text-red-600">*</span>
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
                  styles={{
                    placeholder: (provided: any) => ({
                      ...provided,
                      fontSize: '14px',
                    }),
                  }}
                />
              )}
            />
            {errors.wardId && <p className="mt-2 text-sm text-red-500">{errors.wardId.message}</p>}
          </div>
          <div>
            <Input
              type="text"
              name="houseNumber"
              label="Số nhà, đường"
              placeholder="Nhập số nhà, đường"
              control={control}
              error={errors.houseNumber?.message}
              required={true}
            />
          </div>
        </div>
        {/* Number house */}
        <div className="mt-4 flex flex-col">
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
export default RegisterCompanyComponent;
