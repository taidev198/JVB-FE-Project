/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { DatePicker, Space } from 'antd';
import { Controller } from 'react-hook-form';

interface DatePickerPropsType {
  label?: string;
  placeholder: string;
  name: string;
  control: any;
  error: any;
  required?: boolean;
  showTime?: boolean;
}

const DateComponent: FC<DatePickerPropsType> = ({ name, control, error, placeholder, label, required, showTime = false }) => {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            return (
              <Space direction="vertical" className="w-full">
                <DatePicker
                  {...field}
                  showTime={showTime}
                  placeholder={placeholder}
                  status={error ? 'error' : undefined}
                  onChange={date => {
                    field.onChange(date);
                  }}
                  className="mt-1 h-[42px] !w-full"
                />
                {error && <p className="top-full mt-[-8px] text-[13px] text-red-500">{error}</p>}
              </Space>
            );
          }}
        />
      </div>
    </div>
  );
};

export default DateComponent;
