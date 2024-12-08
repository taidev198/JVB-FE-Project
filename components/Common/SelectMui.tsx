/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';

interface SelectProps {
  name: string;
  label?: string;
  options: { value: number; label: string | undefined }[]; // Mảng các lựa chọn với `value` là số và `label` là chuỗi
  control: Control<any>;
  error?: string;
  className?: string;
  isMultiple?: boolean;
  placeholder: string;
  value?: { value: number; label: string }[]; // Nếu muốn giá trị hiện tại từ bên ngoài
}

const SelectReact: React.FC<SelectProps> = ({ name, label, options, control, error, className, isMultiple = false, placeholder, value }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={isMultiple ? value || [] : value || undefined} // Đảm bảo có giá trị mặc định, lấy từ `value` hoặc `field.value`
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            isMulti={isMultiple}
            className={`!basic-select shadow-none ${error ? 'is-invalid' : ''}`}
            classNamePrefix="select"
            value={
              isMultiple
                ? options.filter(option => field.value?.includes(option.value)) // Hiển thị nhiều lựa chọn đã chọn
                : options.find(option => option.value === field.value) // Hiển thị một lựa chọn đã chọn
            }
            onChange={(selected: any) => {
              const newValue = isMultiple
                ? (selected as { value: number; label: string }[]).map(item => item.value) // Cập nhật giá trị cho lựa chọn nhiều
                : (selected as { value: number; label: string }).value; // Cập nhật giá trị cho lựa chọn đơn
              field.onChange(newValue); // Cập nhật giá trị vào form
            }}
          />
        )}
      />
      {error && <p className="top-full mt-[2px] text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

export default SelectReact;
