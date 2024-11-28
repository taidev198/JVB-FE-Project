import { ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface InputProps {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
  icon?: ReactNode;
}

const Input = ({ name, label, placeholder, control, error, type = 'text', icon }: InputProps) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={`relative `}>
        {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{icon}</span>}
        <Controller
          name={name}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              placeholder={placeholder}
              className={`block w-full rounded-md border px-3 py-2 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-300'} ${
                icon ? 'pl-10' : ''
              } focus:outline-none focus:ring-0`}
              type={type}
            />
          )}
        />
      </div>
      {error && <p className="absolute left-0 top-full mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
