import Image from 'next/image';

import React, { useState, useEffect, useCallback } from 'react';
import SelectOne from './SelectOne';
import SelectSearch from './SelectSearch';
import { useGetProvincesQuery } from '@/services/portalHomeApi';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

const CompaniesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  const statuses = ['Active', 'Closed', 'Pending'];
  const companySizes = ['Small', 'Medium', 'Large'];

  // Fetch provinces data
  const { data: provincesData, isLoading: isProvincesLoading, error: provincesError } = useGetProvincesQuery();

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

  const handleSearch = useCallback((term: string) => {}, []);

  const handleButtonClick = () => {
    handleSearch(searchTerm);
  };

  // Handle loading or error states for provinces
  const locationItems = isProvincesLoading ? [] : provincesData?.data.map(province => province.provinceName) || [];

  if (provincesError) {
    console.error('Failed to fetch provinces');
  }

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
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locationItems} onChange={setSelectedLocation} width={150} />
            <SelectOne label="Quy mô công ty" value={selectedCompanySize} items={companySizes} onChange={setSelectedCompanySize} width={150} />
          </div>
        </div>

        {/* Render company list or filters */}
        {/* Companies */}
        <div className="mt-[40px] grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
          <div className="item group flex flex-col items-center justify-start rounded-[10px] border-[1px] border-solid border-primary-border bg-primary-white p-[30px]">
            <div className="company__icon mb-[20px] flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light">
              <Image src="/images/apple.svg" alt="" width={40} height={40} />
            </div>
            <h4 className="text-2xl font-semibold text-primary-black">Apple</h4>
            <span className="mt-2 text-lg text-primary-gray">Tài Chính - Ngân Hàng</span>
            <div className="mt-2 flex w-full items-center justify-center gap-6 text-lg text-primary-gray">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot "></i>
                <span className="text-lg ">Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-user "></i>
                <span className="text-lg ">20.000+</span>
              </div>
            </div>
            <button className="mp_transition_4 mt-[20px] rounded-md bg-primary-light px-[20px] py-[16px] text-lg hover:bg-primary-main hover:text-primary-white">
              Xem Chi Tiết
            </button>
          </div>
        </div>
        <div className="mt-[80px] w-full">
          <Pagination showSizeChanger align="center" defaultCurrent={1} total={500} />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
