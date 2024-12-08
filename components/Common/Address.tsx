import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import Select from 'react-select';
import { useGetAllDistrictsQuery, useGetAllProvincesQuery, useGetAllWardsQuery } from '@/services/adminSystemApi';

interface OptionType {
  id: number | string; // Chấp nhận cả chuỗi và số
  provinceName?: string;
  districtName?: string;
  wardName?: string;
}

interface SelectProps {
  name: string;
  control: Control<any>;
  error?: string;
  className?: string;
}

const Address = ({ name, control, error, className }: SelectProps) => {
  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [districtId, setDistrictID] = useState<number | null>(null);

  // Fetch data
  const { data: provinces } = useGetAllProvincesQuery();
  const { data: districts } = useGetAllDistrictsQuery({ id: provinceId }, { skip: !provinceId });
  const { data: wards } = useGetAllWardsQuery({ id: districtId }, { skip: !districtId });

  const handleSelectChange = (option: OptionType | null, setter: React.Dispatch<React.SetStateAction<number | null>>) => {
    if (option && option.id) {
      setter(Number(option.id)); // Chuyển đổi `id` sang `number`
    } else {
      setter(null); // Reset giá trị nếu không có lựa chọn
    }
  };

  return (
    <div className={`${className}`}>
      {/* Province */}
      <div>
        <label htmlFor={`${name}-province`} className="mb-1 block text-sm font-semibold text-gray-700">
          Tỉnh
        </label>
        <Controller
          name={`${name}.province`}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Select
              {...field}
              options={
                provinces?.data?.map((province: OptionType) => ({
                  value: province.id.toString(), // Đảm bảo value là string
                  label: province.provinceName || 'Chưa có tên tỉnh',
                })) || []
              }
              getOptionLabel={(option: OptionType) => option.provinceName || ''}
              getOptionValue={(option: OptionType) => option.id.toString()} // Đảm bảo id là string
              className={`!basic-select shadow-none ${error ? 'is-invalid' : ''}`}
              classNamePrefix="select"
              placeholder="Chọn tỉnh"
              onChange={(selectedOption: OptionType | null) => {
                // Chuyển đổi value sang number
                const provinceId = selectedOption ? Number(selectedOption.value) : null;
                field.onChange(provinceId); // Gửi giá trị provinceId vào form
                handleSelectChange(selectedOption, setProvinceId); // Gọi hàm thay đổi tỉnh
                setDistrictID(null); // Reset huyện khi thay đổi tỉnh
              }}
              value={provinces?.data?.find((province: OptionType) => province.id === Number(field.value)) || null}
            />
          )}
        />

        {error && <p className="top-full mt-[2px] text-[13px] text-red-500">{error}</p>}
      </div>

      {/* District */}
      <div>
        <label htmlFor={`${name}-district`} className="mb-1 block text-sm font-semibold text-gray-700">
          Huyện
        </label>
        <Controller
          name={`${name}.district`}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Select
              {...field}
              options={districts?.data || []}
              getOptionLabel={(option: OptionType) => option.districtName || ''}
              getOptionValue={(option: OptionType) => option.id.toString()}
              className={`!basic-select shadow-none ${error ? 'is-invalid' : ''}`}
              classNamePrefix="select"
              placeholder="Chọn huyện"
              isDisabled={!provinceId}
              onChange={(selectedOption: OptionType | null) => {
                field.onChange(selectedOption);
                handleSelectChange(selectedOption, setDistrictID);
              }}
            />
          )}
        />
      </div>

      {/* Ward */}
      <div>
        <label htmlFor={`${name}-ward`} className="mb-1 block text-sm font-semibold text-gray-700">
          Xã
        </label>
        <Controller
          name={`${name}.ward`}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Select
              {...field}
              options={wards?.data || []}
              getOptionLabel={(option: OptionType) => option.wardName || ''}
              getOptionValue={(option: OptionType) => option.id.toString()}
              className={`!basic-select shadow-none ${error ? 'is-invalid' : ''}`}
              classNamePrefix="select"
              placeholder="Chọn xã"
              isDisabled={!districtId}
              onChange={(selectedOption: OptionType | null) => {
                field.onChange(selectedOption);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Address;
