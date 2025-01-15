/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { Empty, Pagination } from 'antd';
import Link from 'next/link';
import { debounce } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import SelectSearch from '../common/SelectSearch';
import PortalLoading from '../common/PortalLoading';

import ImageComponent from '@/components/Common/Image';
import { useGetFieldsQuery, useGetProvincesQuery, useGetSchoolsQuery } from '@/services/portalHomeApi';

const SchoolsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Initial page size

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: schoolsData, isLoading: isSchoolsLoading } = useGetSchoolsQuery(
    {
      page: currentPage,
      size: pageSize,
      keyword: searchTerm,
      province: selectedLocation ? provincesData?.data.find(province => province.provinceName === selectedLocation)?.id : undefined,
      field: selectedField ? fieldsData?.data.find(field => field.fieldName === selectedField)?.id : undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

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
        <form className="search-input absolute top-[-42px] flex w-full gap-[15px] rounded-2xl bg-primary-white p-[15px] shadow-lg">
          <div className="flex w-full items-center gap-[10px] rounded-[10px] bg-primary-light px-[20px] py-[15px] text-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Nhập tên trường học..."
              className="w-full border-none bg-transparent p-0 outline-none"
              value={searchTerm}
              onChange={e => debouncedSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="hidden min-w-[154px] rounded-[10px] bg-primary-main px-[20px] text-lg text-primary-white lg:block">
            Tìm trường
          </button>
        </form>
        <div className="mt-[70px] flex items-center justify-between">
          <span className="hidden font-medium text-primary-black md:block">
            {schoolsData?.data.content.length
              ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, schoolsData?.data.content.length)} trong ${
                  schoolsData?.data.totalElements
                } kết quả`
              : ''}
          </span>
          <div className="flex items-center gap-4">
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locationItems} onChange={setSelectedLocation} width={150} />
            <SelectSearch label="Lĩnh vực" value={selectedField} items={fieldItems} onChange={setSelectedField} width={150} />
            {/*<SelectSearch label="Loại trường" value={selectedType} items={typesItems} onChange={setSelectedType} width={180} />*/}
          </div>
        </div>

        <div className="mt-[40px]">
          {isSchoolsLoading ? (
            <div className="my-[60px] flex w-full items-center justify-center">
              <PortalLoading />
            </div>
          ) : schoolsData?.data?.content.length > 0 ? (
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {schoolsData?.data?.content.map(university => (
                <div
                  key={university.id}
                  className="item group flex flex-col items-center justify-start rounded-[10px] border-[1px] border-solid border-primary-border bg-primary-white p-[30px]">
                  <div className="university__icon mb-[20px] flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light">
                    <ImageComponent
                      src={university.logoUrl || '/images/default-logo.png'}
                      alt={university.universityName}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                  <h4 className="max-w-[90%] truncate text-2xl font-semibold text-primary-black">{university.universityName}</h4>
                  <span className="mt-2 text-lg text-primary-gray">{university.universityCode}</span>
                  <div className="mt-2 flex w-full items-center justify-center gap-6 text-lg text-primary-gray">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <span className="text-lg">{university.address.province.provinceName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-user"></i>
                      <span className="text-lg">{university.numberOfStudents}+</span>
                    </div>
                  </div>
                  <Link
                    href={`/portal/schools/${university.id}`}
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

        {schoolsData && (
          <div className="mt-[80px] w-full">
            <Pagination
              current={currentPage}
              total={schoolsData?.data.totalElements}
              pageSize={pageSize}
              showSizeChanger
              align="center"
              pageSizeOptions={['9', '10', '20', '50', '100']}
              onChange={handlePageChange}
              onShowSizeChange={(_, size) => handlePageChange(1, size)} // Reset to first page on size change
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsList;
