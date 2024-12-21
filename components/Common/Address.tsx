/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';

interface AddressProps {
  control: Control<any>;
  provinceName: string;
  districtName: string;
  wardName: string;
  errorProvince?: string;
  errorDistrict?: string;
  errorWard?: string;
  className: string;
  children?: React.ReactNode;
}

const Address: FC<AddressProps> = ({ provinceName, districtName, wardName, control, errorProvince, errorDistrict, errorWard, className, children }) => {
  const { watch } = useFormContext();

  const provinceSelect = watch('provinceId');
  const districtSelect = watch('districtId');

  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWard } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  return (
    <div className={`mt-4 ${className}`}>
      <div>
        <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
          Tỉnh <span className="text-red-600">*</span>
        </label>
        <Controller
          name={provinceName}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Chọn Tỉnh/Thành phố"
              isLoading={isLoadingProvinces}
              options={provinces?.data || []}
              getOptionLabel={(option: { provinceName: any }) => option.provinceName || ''}
              getOptionValue={(option: { id: any }) => option.id}
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null);
              }}
              value={provinces?.data?.find(option => option.id === field.value)}
              ref={field.ref}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  borderColor: errorProvince ? 'red' : state.isFocused ? '' : '',
                  boxShadow: errorProvince ? '0 0 0 0px red' : state.isFocused ? '' : 'none',
                  '&:hover': {
                    borderColor: errorProvince ? 'red' : state.isFocused ? '' : '',
                  },
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  fontSize: '14px',
                }),
              }}
            />
          )}
        />
        {errorProvince && typeof errorProvince === 'string' && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorProvince}</p>}
      </div>

      {/* Chọn Huyện */}
      <div>
        <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
          Huyện <span className="text-red-600">*</span>
        </label>
        <Controller
          name={districtName}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Chọn Quận/Huyện"
              isLoading={isLoadingDistricts}
              options={districts?.data || []}
              getOptionLabel={(option: { districtName: any }) => option.districtName || ''}
              getOptionValue={(option: { id: any }) => option.id}
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null);
              }}
              value={districts?.data?.find(option => option.id === field.value)}
              ref={field.ref}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  borderColor: errorDistrict ? 'red' : state.isFocused ? '' : '',
                  boxShadow: errorDistrict ? '0 0 0 0px red' : state.isFocused ? '' : 'none',
                  '&:hover': {
                    borderColor: errorDistrict ? 'red' : state.isFocused ? '' : '',
                  },
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  fontSize: '14px',
                }),
              }}
            />
          )}
        />
        {errorDistrict && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorDistrict}</p>}
      </div>

      {/* Chọn Xã */}
      <div>
        <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
          Xã <span className="text-red-600">*</span>
        </label>
        <Controller
          name={wardName}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Chọn Xã/Phường"
              isLoading={isLoadingWard}
              options={wards?.data || []}
              getOptionLabel={(option: { wardName: any }) => option.wardName || ''}
              getOptionValue={(option: { id: any }) => option.id}
              onChange={(selectedOption: { id: any }) => {
                field.onChange(selectedOption ? selectedOption.id : null);
              }}
              value={wards?.data?.find(option => option.id === field.value)}
              ref={field.ref}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  borderColor: errorWard ? 'red' : state.isFocused ? '' : '',
                  boxShadow: errorWard ? '0 0 0 0px red' : state.isFocused ? '' : 'none',
                  '&:hover': {
                    borderColor: errorWard ? 'red' : state.isFocused ? '' : '',
                  },
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  fontSize: '14px',
                }),
              }}
            />
          )}
        />
        {errorWard && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorWard}</p>}
      </div>

      {children}
    </div>
  );
};
export default Address;
