import React from 'react';
import { Select } from 'antd';

interface SelectSearchProps {
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string | null) => void;
  width?: string | number;
}

const SelectSearch: React.FC<SelectSearchProps> = ({ label, value, items, onChange, width = '100%' }) => {
  return (
    <div className="relative w-full" style={{ width }}>
      {/* Ant Design Select with Search, Max Height, and Clearable Input */}
      <Select
        showSearch
        size="large"
        placeholder={label}
        value={value || undefined}
        onChange={newValue => onChange(newValue || null)} // Cho phép xóa input về null
        allowClear // Hiển thị nút xóa
        style={{ width: '100%' }}
        options={items.map(item => ({
          value: item,
          label: item,
        }))}
        optionFilterProp="label"
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      />
    </div>
  );
};

export default SelectSearch;
