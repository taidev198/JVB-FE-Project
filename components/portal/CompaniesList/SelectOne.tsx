import React, { useState, useEffect } from 'react';

interface SelectOneProps {
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string) => void;
  width?: string | number;
}

const SelectOne: React.FC<SelectOneProps> = ({ label, value, items, onChange, width = '100%' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: string) => {
    onChange(item); // Set the selected value
    setIsOpen(false); // Close the dropdown
  };

  return (
    <div className="relative w-full select-none" style={{ width }}>
      {/* Display selected value or label */}
      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="max-w-[190px] truncate">{value || label}</span>
        <span>{isOpen ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-1 shadow-lg">
          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {items.length > 0 ? (
              items.map(item => (
                <div
                  key={item}
                  className={`cursor-pointer p-2 hover:bg-gray-200 ${value === item ? 'bg-primary-light font-medium text-primary-main' : ''}`}
                  onClick={() => handleItemClick(item)}>
                  {item}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">Không có kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectOne;
