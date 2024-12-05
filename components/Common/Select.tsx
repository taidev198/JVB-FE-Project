/* eslint-disable @typescript-eslint/no-explicit-any */
// Select.tsx
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  error?: string;
  className?: string;
}

const Select = ({ name, label, options, control, error, className }: SelectProps) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            className={`block w-full cursor-pointer rounded-md border px-3 py-2 text-sm ${
              error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 placeholder:text-sm focus:border-gray-300'
            } focus:outline-none focus:ring-0`}>
            {options.map((option, index) => (
              <option key={index} value={option.value} className="text-sm">
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
