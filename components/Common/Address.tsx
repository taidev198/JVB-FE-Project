/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';
import { Select } from 'antd';
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
  const { watch, setValue } = useFormContext();

  const provinceSelect = watch(provinceName);
  const districtSelect = watch(districtName);

  // Fetch data
  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } = useGetAllDistrictsQuery({ id: provinceSelect }, { skip: !provinceSelect });
  const { data: wards, isLoading: isLoadingWards } = useGetAllWardsQuery({ id: districtSelect }, { skip: !districtSelect });

  const handleProvinceChange = (value: string | null) => {
    setValue(provinceName, value);
    setValue(districtName, null);
    setValue(wardName, null);
  };

  const handleDistrictChange = (value: string | null) => {
    setValue(districtName, value);
    setValue(wardName, null);
  };

  const renderSelect = (
    name: string,
    error: string | undefined,
    options: any[],
    loading: boolean,
    placeholder: string,
    labelKey: string,
    valueKey: string,
    onChange?: (value: string | null) => void
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          status={`${error ? 'error' : ''}`}
          showSearch
          allowClear
          placeholder={placeholder}
          optionFilterProp="label"
          loading={loading}
          options={options.map(option => ({
            value: option[valueKey],
            label: option[labelKey],
          }))}
          onChange={value => {
            field.onChange(value);
            if (onChange) onChange(value);
          }}
          onClear={() => field.onChange(null)}
          className="h-[42px] w-full"
        />
      )}
    />
  );

  return (
    <div className={`mt-[16px] ${className}`}>
      {/* Province Select */}
      <div>
        <label htmlFor="provinceId" className="mb-1 block text-sm font-semibold text-gray-700">
          Tỉnh <span className="text-red-600">*</span>
        </label>
        {renderSelect(provinceName, errorProvince, provinces?.data || [], isLoadingProvinces, 'Chọn Tỉnh', 'provinceName', 'id', handleProvinceChange)}
        {errorProvince && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorProvince}</p>}
      </div>

      {/* District Select */}
      <div>
        <label htmlFor="districtId" className="mb-1 block text-sm font-semibold text-gray-700">
          Huyện <span className="text-red-600">*</span>
        </label>
        {renderSelect(districtName, errorDistrict, districts?.data || [], isLoadingDistricts, 'Chọn Huyện', 'districtName', 'id', handleDistrictChange)}
        {errorDistrict && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorDistrict}</p>}
      </div>

      {/* Ward Select */}
      <div>
        <label htmlFor="wardId" className="mb-1 block text-sm font-semibold text-gray-700">
          Xã <span className="text-red-600">*</span>
        </label>
        {renderSelect(wardName, errorWard, wards?.data || [], isLoadingWards, 'Chọn Xã', 'wardName', 'id')}
        {errorWard && <p className="top-full mt-[2px] text-[13px] text-red-500">{errorWard}</p>}
      </div>

      {children}
    </div>
  );
};

export default Address;
