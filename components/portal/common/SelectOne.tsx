import React from 'react';
import { Select } from 'antd';

interface SelectOneProps {
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string) => void;
  width?: string | number;
}

const SelectOne: React.FC<SelectOneProps> = ({ label, value, items, onChange, width = '100%' }) => {
  return (
    <div className="relative w-full" style={{ width }}>
      {/* Ant Design Select */}
      <Select
        size="large"
        placeholder={label}
        value={value || undefined}
        onChange={onChange}
        style={{ width: '100%' }}
        options={items.map(item => ({
          value: item,
          label: item,
        }))}
        dropdownRender={menu => <div style={{ maxHeight: '200px', overflowY: 'auto' }}>{menu}</div>}
      />
    </div>
  );
};

export default SelectOne;
