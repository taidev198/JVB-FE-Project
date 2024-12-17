import React, { useState, useEffect, useCallback } from 'react';
import { useGetProvincesQuery, useGetCompaniesQuery } from '@/services/portalHomeApi';
import { Pagination } from 'antd';
import Image from 'next/image';
import SelectSearch from './SelectSearch';
import { ICompany } from '@/types/companyType';

const CompaniesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Fetch provinces data
  const { data: provincesData, isLoading: isProvincesLoading, error: provincesError } = useGetProvincesQuery();

  // Fetch companies data
  const {
    data: companiesData,
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useGetCompaniesQuery({
    page: currentPage,
    size: pageSize,
    keyword: searchTerm,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1); // Reset to the first page on search
  }, []);

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
      handleSearch();
    }
  }, [debouncedValue]);

  const handleButtonClick = () => {
    handleSearch();
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
          <span className="font-medium text-primary-black">
            {companiesData
              ? `${(currentPage - 1) * pageSize + 1} - ${(currentPage - 1) * pageSize + companiesData?.data.content.length} trong ${
                  companiesData?.data.totalElements
                } kết quả`
              : 'Loading...'}
          </span>
          <div className="flex items-center gap-4">
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locationItems} onChange={setSelectedLocation} width={150} />
          </div>
        </div>

        {/* Companies List */}
        <div className="mt-[40px] grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
          {isCompaniesLoading ? (
            <p>Loading companies...</p>
          ) : (
            companiesData?.data.content.map((company: ICompany) => (
              <div
                key={company.id}
                className="item group flex flex-col items-center justify-start rounded-[10px] border-[1px] border-solid border-primary-border bg-primary-white p-[30px]">
                <div className="company__icon mb-[20px] flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light">
                  <Image src={company.logoUrl || '/images/default-logo.png'} alt={company.companyName} width={40} height={40} className="object-cover" />
                </div>
                <h4 className="text-2xl font-semibold text-primary-black">{company.companyName}</h4>
                <span className="mt-2 text-lg text-primary-gray">Tài Chính - Ngân Hàng</span>
                <div className="mt-2 flex w-full items-center justify-center gap-6 text-lg text-primary-gray">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="text-lg">{company.address.province.provinceName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-user"></i>
                    <span className="text-lg">20.000+</span>
                  </div>
                </div>
                <button className="mp_transition_4 mt-[20px] rounded-md bg-primary-light px-[20px] py-[16px] text-lg hover:bg-primary-main hover:text-primary-white">
                  Xem Chi Tiết
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {companiesData && (
          <div className="mt-[80px] w-full">
            <Pagination
              current={currentPage}
              total={companiesData.data.totalElements}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={handlePageChange}
              align="center"
              showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesList;
