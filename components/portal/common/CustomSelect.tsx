import React, { useState, useEffect } from 'react';

interface CustomSelectProps {
  label: string;
  value: string[];
  items: string[];
  onChange: (selected: string[]) => void;
  width?: string | number;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, items, onChange, width = '100%' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // Filter items based on the search term
  useEffect(() => {
    setFilteredItems(items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, items]);

  const handleItemClick = (item: string) => {
    // Toggle the selection of items
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full select-none" style={{ width }}>
      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="max-w-[190px] truncate ">{value.length > 0 ? value.join(', ') : label}</span>
        <span>{isOpen ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-1">
          <input type="text" className="w-full border-none p-2 outline-none " placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearchChange} />
          <div className="max-h-40 overflow-y-auto">
            {filteredItems.map(item => (
              <div key={item} className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleItemClick(item)}>
                <div className="inline-flex items-center gap-2">
                  <label className="relative flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={value.includes(item)}
                      readOnly
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all  checked:bg-primary-black hover:shadow-md"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </label>
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
