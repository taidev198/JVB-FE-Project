import React, { useState, useEffect, useCallback } from 'react';
import SelectOne from './SelectOne';
import SelectSearch from './SelectSearch';

const CompaniesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  const locations = ['Hà Nội', 'Quảng Ninh', 'Sài Gòn', 'Đà Nẵng'];
  const statuses = ['Active', 'Closed', 'Pending'];
  const companySizes = ['Small', 'Medium', 'Large'];

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedValue) {
      handleSearch(debouncedValue);
    }
  }, [debouncedValue]);

  const handleSearch = useCallback((term: string) => {
    console.log('Searching for:', term);
    // Trigger your search logic here
  }, []);

  const handleButtonClick = () => {
    handleSearch(searchTerm);
  };

  return (
    <div className="rts__section">
      <div className="mp_section_padding container relative mx-auto">
        {/* Search Input */}
        <form className="search-input absolute top-[-42px] flex w-full gap-[15px] rounded-2xl bg-primary-white p-[15px]">
          <div className="flex w-full items-center gap-[10px] rounded-[10px] bg-primary-light px-[20px] py-[15px] text-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Nhập tên công ty..."
              className="w-full border-none bg-transparent p-0 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleButtonClick}
            className="hidden min-w-[154px] rounded-[10px] bg-primary-main px-[20px] text-lg text-primary-white lg:block">
            Tìm công ty
          </button>
        </form>

        {/* Filter and Results */}
        <div className="mt-[70px] flex items-center justify-between">
          <span className="font-medium text-primary-black">1-9 trong 19 kết quả</span>
          <div className="flex items-center gap-4">
            <SelectSearch label="Trạng thái" value={selectedStatus} items={statuses} onChange={setSelectedStatus} width={150} />
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locations} onChange={setSelectedLocation} width={150} />
            <SelectOne label="Quy mô công ty" value={selectedCompanySize} items={companySizes} onChange={setSelectedCompanySize} width={150} />
          </div>
        </div>

        {/* Render company list or filters */}
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3"></div>
      </div>
    </div>
  );
};

export default CompaniesList;
