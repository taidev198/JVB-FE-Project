import React from 'react';
import { Select } from 'antd';

interface SelectSearchProps {
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string) => void;
  width?: string | number;
}

const SelectSearch: React.FC<SelectSearchProps> = ({ label, value, items, onChange, width = '100%' }) => {
  return (
    <div className="relative w-full" style={{ width }}>
      {/* Ant Design Select with Search and Max Height */}
      <Select
        showSearch
        size="large"
        placeholder={label}
        value={value || undefined}
        onChange={onChange}
        style={{ width: '100%' }}
        options={items.map(item => ({
          value: item,
          label: item,
        }))}
        optionFilterProp="label"
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        dropdownRender={menu => <div style={{ maxHeight: '200px', overflowY: 'auto' }}>{menu}</div>} // Sets max height and scroll
      />
    </div>
  );
};

export default SelectSearch;
