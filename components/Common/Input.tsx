/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from 'react-hook-form';

interface InputProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  control: Control<any>;
  error?: string;
}

const Input = ({ name, label, placeholder, control, error, type = 'text' }: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            placeholder={placeholder}
            className={`mt-2 block w-full rounded-md border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
            type={type}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
