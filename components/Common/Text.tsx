/* eslint-disable @typescript-eslint/no-explicit-any */
// Input.tsx
import { Control, Controller } from 'react-hook-form';

interface textProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  control: Control<any>;
  error?: string;
  required?: boolean;
}

const Text = ({ name, label, placeholder, control, error, required }: textProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            rows={6}
            placeholder={placeholder}
            className={`mt-2 block w-full rounded-md border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Text;
