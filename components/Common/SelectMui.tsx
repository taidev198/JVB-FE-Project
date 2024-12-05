import React, { useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl, ListItemText, Chip, Box, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  options: { value: number; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
  className?: string;
  isMultiple?: boolean;
}

const SelectMui = ({ name, label, options, control, error, className, isMultiple }: SelectProps) => {
  const [search, setSearch] = useState('');
  const [selectedValues, setSelectedValues] = useState<number[]>([]); // State cho các giá trị đã chọn

  // Lọc danh sách dựa trên tìm kiếm
  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (valueToRemove: string | number, event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    const updatedValues = selectedValues.filter((val: string | number) => val !== valueToRemove);
    setSelectedValues(updatedValues); // Cập nhật giá trị đã chọn
  };

  return (
    <div className={`${className}`}>
      {label && (
        <InputLabel htmlFor={name} className="mb-1 block text-sm !font-semibold text-gray-700">
          {label}
        </InputLabel>
      )}

      {/* Hiển thị các Chip bên ngoài Select */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
        {selectedValues.map(value => {
          const option = options.find(option => option.value === value);
          return option ? <Chip key={value} label={option.label} size="small" onDelete={event => handleDelete(value, event)} clickable={false} /> : null;
        })}
      </Box>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <FormControl
              fullWidth
              error={Boolean(error)}
              variant="outlined"
              sx={{
                maxWidth: '100%',
                height: '1px',
                '& .MuiInputBase-root': {
                  height: '100%',
                },
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                },
              }}
              size="small">
              <Select
                {...field}
                id={name}
                multiple={isMultiple}
                value={selectedValues}
                onChange={e => {
                  const value = Array.isArray(e.target.value) //+
                    ? e.target.value.map((item: number) => Number(item)) //+
                    : [Number(e.target.value)]; //+
                  setSelectedValues(value); //+
                  field.onChange(value); //+
                }} //+
                displayEmpty
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, opacity: '0', height: '20px' }}>
                    {selected.map((value: string | number) => {
                      const option = options.find(option => option.value === value);
                      return option ? (
                        <Chip
                          key={value}
                          label={option.label}
                          size="small"
                          onDelete={event => handleDelete(value, event)} // Xử lý xóa chip
                        />
                      ) : null;
                    })}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: 250,
                    },
                  },
                }}
                className="block w-full cursor-pointer rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-0">
                <TextField
                  placeholder="Tìm kiếm..."
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  sx={{ mb: 1, px: 2 }}
                />
                {filteredOptions.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </FormControl>
          );
        }}
      />
    </div>
  );
};

export default SelectMui;
