import React, { ReactNode } from 'react';
import { Select } from 'antd';
import { CSSProperties } from 'styled-components';

interface SelectSearchProps {
  icon?: ReactNode;
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string | null) => void;
  width?: string | number;
  customStyles?: CSSProperties;
}

const SelectSearch: React.FC<SelectSearchProps> = ({ icon, label, value, items, onChange, width = '100%', customStyles }) => {
  return (
    <div className="relative w-full" style={{ width }}>
      {/* Ant Design Select with Search, Max Height, and Clearable Input */}
      <Select
        prefix={icon}
        showSearch
        size="large"
        placeholder={label}
        value={value || undefined}
        onChange={newValue => onChange(newValue || null)} // Cho phép xóa input về null
        allowClear // Hiển thị nút xóa
        style={{ width: '100%', ...customStyles }}
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
