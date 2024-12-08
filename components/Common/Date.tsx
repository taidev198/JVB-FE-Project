import { ReactNode, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Control, Controller } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css'; // Đừng quên import CSS của react-datepicker

interface InputProps {
  name: string;
  label?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
  icon?: ReactNode;
}

const Date = ({ name, label, placeholder, control, error, icon }: InputProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null); // Dùng useState để lưu trữ giá trị ngày giờ

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{icon}</span>}

        <Controller
          name={name}
          control={control}
          defaultValue={startDate}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={startDate}
              onChange={(date: Date | null) => {
                setStartDate(date);
                field.onChange(date);
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText={placeholder}
              showIcon
            />
          )}
        />
      </div>

      {error && <p className="top-full mt-[2px] text-[13px] text-red-500">{error}</p>}
    </div>
  );
};

export default Date;
