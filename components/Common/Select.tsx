/* eslint-disable @typescript-eslint/no-explicit-any */
// Select.tsx
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  error?: string;
}

const Select = ({ name, label, options, control, error }: SelectProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            className={`mt-2 block w-full cursor-pointer rounded-md border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
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
