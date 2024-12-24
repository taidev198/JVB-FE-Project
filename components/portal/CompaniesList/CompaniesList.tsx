import React, { useState, useEffect, useCallback } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import SelectSearch from './SelectSearch';
import { ICompany } from '@/types/companyType';
import { useGetProvincesQuery, useGetCompaniesQuery, useGetFieldsQuery } from '@/services/portalHomeApi';
import ImageComponent from '@/components/Common/Image';

const CompaniesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<string | null>(null);
  const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedCompanies, setPaginatedCompanies] = useState<ICompany[]>([]);
  const [pageSize, setPageSize] = useState(9); // Initial page size

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: companiesData, isLoading: isCompaniesLoading } = useGetCompaniesQuery({
    page: 1,
    size: 1000,
    keyword: searchTerm,
  });

  const scaleItems = ['Dưới 10 nhân viên', '10 - 50', '51 - 200', '200 - 500', 'Trên 500'];

  useEffect(() => {
    if (companiesData?.data.content) {
      let filtered = companiesData.data.content;

      if (selectedLocation) {
        filtered = filtered.filter(company => company.address.province.provinceName === selectedLocation);
      }

      if (selectedField) {
        filtered = filtered.filter(
          company => company.fields && Array.isArray(company.fields) && company.fields.some(field => field.fieldName === selectedField)
        );
      }

      if (selectedScale) {
        filtered = filtered.filter(company => {
          const quantity = company.quantityEmployee;
          switch (selectedScale) {
            case 'Dưới 10 nhân viên':
              return quantity < 10;
            case '10 - 50':
              return quantity >= 10 && quantity <= 50;
            case '51 - 200':
              return quantity >= 51 && quantity <= 200;
            case '200 - 500':
              return quantity >= 201 && quantity <= 500;
            case 'Trên 500':
              return quantity > 500;
            default:
              return true;
          }
        });
      }

      if (searchTerm) {
        filtered = filtered.filter(company => company.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredCompanies(filtered);
      setCurrentPage(1);
    }
  }, [companiesData, selectedLocation, selectedField, selectedScale, searchTerm]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedCompanies(filteredCompanies.slice(start, end));
  }, [filteredCompanies, currentPage, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedValue) {
      handleSearch();
    }
  }, [debouncedValue]);

  const locationItems = isProvincesLoading ? [] : provincesData?.data.map(province => province.provinceName) || [];
  const fieldItems = isFieldsLoading ? [] : fieldsData?.data.map(field => field.fieldName) || [];

  return (
    <div className="rts__section">
      <div className="mp_section_padding container relative mx-auto">
        <form className="search-input absolute top-[-42px] z-[2] flex w-full gap-[15px] rounded-2xl bg-primary-white p-[15px] shadow-lg">
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
            onClick={handleSearch}
            className="hidden min-w-[154px] rounded-[10px] bg-primary-main px-[20px] text-lg text-primary-white lg:block">
            Tìm công ty
          </button>
        </form>
        <div className="mt-[70px] flex items-center justify-between">
          <span className="hidden font-medium text-primary-black md:block">
            {paginatedCompanies.length
              ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredCompanies.length)} trong ${filteredCompanies.length} kết quả`
              : ''}
          </span>
          <div className="flex items-center gap-4">
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locationItems} onChange={setSelectedLocation} width={150} />
            <SelectSearch label="Lĩnh vực" value={selectedField} items={fieldItems} onChange={setSelectedField} width={150} />
            <SelectSearch label="Quy mô" value={selectedScale} items={scaleItems} onChange={setSelectedScale} width={150} />
          </div>
        </div>

        <div className="mt-[40px]">
          {isCompaniesLoading ? (
            <div className="flex w-full items-center justify-center">
              <Spin size="large" />
            </div>
          ) : paginatedCompanies.length > 0 ? (
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {paginatedCompanies.map(company => (
                <div
                  key={company.id}
                  className="item group flex flex-col items-center justify-start rounded-[10px] border-[1px] border-solid border-primary-border bg-primary-white p-[30px] text-center">
                  <div className="company__icon mb-[20px] flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light">
                    <ImageComponent
                      src={company.logoUrl || '/images/user-default.png'}
                      alt={company.companyName}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  <h4 className="w-full truncate text-2xl font-semibold text-primary-black ">{company.companyName}</h4>
                  <span className="mt-2 text-lg text-primary-gray">{company.companyCode}</span>
                  <div className="mt-2 flex w-full items-center justify-center gap-6 text-lg text-primary-gray">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <span className="text-lg">{company.address.province.provinceName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-user"></i>
                      <span className="text-lg">{company.quantityEmployee}+</span>
                    </div>
                  </div>
                  <Link
                    href={`/portal/companies/${company.id}`}
                    className="mp_transition_4 mt-[20px] rounded-md bg-primary-light px-[20px] py-[16px] text-lg hover:bg-primary-main hover:text-primary-white">
                    Xem Chi Tiết
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full items-center justify-center">
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </div>

        <div className="mt-[80px] w-full">
          <Pagination
            current={currentPage}
            total={filteredCompanies.length}
            pageSize={pageSize}
            showSizeChanger
            align="center"
            onChange={handlePageChange}
            onShowSizeChange={(_, size) => handlePageChange(1, size)} // Reset to first page on size change
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
