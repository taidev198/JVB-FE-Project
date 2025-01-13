/* eslint-disable react-hooks/exhaustive-deps */
import { Empty, Pagination } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import PortalLoading from '../common/PortalLoading';
import SelectSearch from './SelectSearch';
import ImageComponent from '@/components/Common/Image';
import { useGetCompaniesQuery, useGetFieldsQuery, useGetProvincesQuery } from '@/services/portalHomeApi';

const CompaniesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<string | null>(null);
  const [minQuantityEmployee, setMinQuantityEmployee] = useState<number | null>(null);
  const [maxQuantityEmployee, setMaxQuantityEmployee] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Initial page size

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: companiesData, isLoading: isCompaniesLoading } = useGetCompaniesQuery({
    page: currentPage,
    size: pageSize,
    keyword: searchTerm,
    provinceIdSearch: selectedLocation ? provincesData?.data.find(province => province.provinceName === selectedLocation)?.id : undefined,
    fieldId: selectedField ? fieldsData?.data.find(field => field.fieldName === selectedField)?.id : undefined,
    minQuantityEmployee,
    maxQuantityEmployee,
  });

  const scaleItems = ['Dưới 10 nhân viên', '10 - 50', '51 - 200', '200 - 500', 'Trên 500'];

  const updateEmployeeQuantities = (scale: string | null) => {
    switch (scale) {
      case 'Dưới 10 nhân viên':
        setMinQuantityEmployee(1);
        setMaxQuantityEmployee(10);
        break;
      case '10 - 50':
        setMinQuantityEmployee(10);
        setMaxQuantityEmployee(50);
        break;
      case '51 - 200':
        setMinQuantityEmployee(51);
        setMaxQuantityEmployee(200);
        break;
      case '200 - 500':
        setMinQuantityEmployee(200);
        setMaxQuantityEmployee(500);
        break;
      case 'Trên 500':
        setMinQuantityEmployee(501);
        setMaxQuantityEmployee(null);
        break;
      default:
        setMinQuantityEmployee(null);
        setMaxQuantityEmployee(null);
        break;
    }
  };

  useEffect(() => {
    updateEmployeeQuantities(selectedScale);
  }, [selectedScale]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setSearchTerm(value);
        setCurrentPage(1);
      }, 500),
    [searchTerm]
  );

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
              onChange={e => debouncedSearch(e.target.value)}
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
            {companiesData?.data.content.length
              ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, companiesData?.data.content.length)} trong ${
                  companiesData?.data.totalElements
                } kết quả`
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
            <div className=" my-[60px] flex w-full items-center justify-center">
              <PortalLoading />
            </div>
          ) : companiesData?.data?.content.length > 0 ? (
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {companiesData?.data?.content.map(company => (
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
            <div className="my-[60px] flex w-full items-center justify-center">
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </div>

        <div className="mt-[80px] w-full">
          <Pagination
            current={currentPage}
            total={companiesData?.data.totalElements}
            pageSize={pageSize}
            showSizeChanger
            align="center"
            pageSizeOptions={['9', '10', '20', '50', '100']}
            onChange={handlePageChange}
            onShowSizeChange={(_, size) => handlePageChange(1, size)} // Reset to first page on size change
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
