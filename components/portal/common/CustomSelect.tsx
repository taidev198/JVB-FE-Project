import React, { useState, useEffect } from 'react';

interface CustomSelectProps {
  label: string;
  value: string | null;
  items: string[];
  onChange: (selected: string) => void;
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
    onChange(item); // Set the selected value
    setIsOpen(false); // Close the dropdown
    setSearchTerm(''); // Reset the search term
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full select-none" style={{ width }}>
      {/* Input */}
      <div className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="max-w-[190px] truncate">{value || <span className="text-gray-400">{label}</span>}</span>
        <span>{isOpen ? <i className="fa-solid fa-chevron-up" /> : <i className="fa-solid fa-chevron-down" />}</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-1 shadow-lg">
          {/* Search Input */}
          <input type="text" className="w-full border-none p-2 outline-none" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearchChange} />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item} className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleItemClick(item)}>
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

export default CustomSelect;
