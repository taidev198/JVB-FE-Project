import { Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Chip, Box } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  options: { value: string | number; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
  className?: string;
  isMultiple?: boolean;
}

const SelectMui = ({ name, label, options, control, error, className, isMultiple }: SelectProps) => {
  return (
    <div className={`${className}`}>
      {label && (
        <InputLabel htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </InputLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(error)} variant="outlined" sx={{ maxWidth: '100%' }}>
            <Select
              {...field}
              id={name}
              multiple={isMultiple}
              value={field.value || []} // Set default value as empty array for multiple selection
              onChange={e => {
                // Chuyển đổi các giá trị từ chuỗi sang số
                const value = e.target.value.map((item: string) => Number(item));
                field.onChange(value);
              }}
              renderValue={selected => {
                if (Array.isArray(selected)) {
                  return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {selected.map(value => {
                        const option = options.find(option => option.value === value);
                        return option ? <Chip key={value} label={option.label} size="small" /> : null;
                      })}
                    </Box>
                  );
                }
                return '';
              }}
              displayEmpty
              className="block w-full cursor-pointer rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-0">
              {options.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {isMultiple && <Checkbox checked={field.value?.includes(option.value)} />}
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </FormControl>
        )}
      />
    </div>
  );
};

export default SelectMui;
