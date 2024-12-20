/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';

interface SelectProps {
  name: string;
  label?: string;
  options: { value: number | string; label: string | undefined }[];
  control: Control<any>;
  error?: string;
  className?: string;
  isMultiple?: boolean;
  placeholder: string;
  value?: { value: number | string; label: string }[];
  required?: boolean;
}

const SelectReact: React.FC<SelectProps> = ({ name, label, options, control, error, className, isMultiple = false, placeholder, value, required = false }) => {
  return (
    <div className={`form-group mt-auto ${className}`}>
      {label && (
        <label htmlFor={name} className=" block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className={`relative mt-1`}>
        <Controller
          name={name}
          control={control}
          defaultValue={isMultiple ? value || [] : value || undefined}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              placeholder={placeholder}
              isMulti={isMultiple}
              className={`!basic-select py-1 shadow-none ${error ? 'is-invalid' : ''}`}
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
              styles={{
                control: (base: any) => ({
                  ...base,
                  borderColor: error ? 'red' : '',
                  '&:hover': {
                    borderColor: error ? 'red' : '',
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
      </div>
      {error && <p className="top-full mt-[2px] text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

export default SelectReact;
