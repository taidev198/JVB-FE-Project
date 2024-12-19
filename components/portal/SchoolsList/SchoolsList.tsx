import React, { useState, useEffect, useCallback } from 'react';
import { Pagination, Spin, Empty } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import SelectSearch from '../common/SelectSearch';
import { useGetProvincesQuery, useGetFieldsQuery, useGetSchoolsQuery } from '@/services/portalHomeApi';
import { IUniversity } from '@/types/university';

const SchoolsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredSchools, setFilteredSchools] = useState<IUniversity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedSchools, setPaginatedSchools] = useState<IUniversity[]>([]);
  const pageSize = 9;

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: schoolsData, isLoading: isSchoolsLoading } = useGetSchoolsQuery(
    {
      page: 1,
      size: 1000,
      keyword: searchTerm,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log(schoolsData);

  const typesItems = ['Học viện', 'Cao đẳng', 'Đại học', 'Khác'];
  // const typesItem = ['ACADEMY', 'COLLEGE', 'OTHER', 'UNIVERSITY'];

  useEffect(() => {
    if (schoolsData?.data.content) {
      let filtered = schoolsData.data.content;

      if (selectedLocation) {
        filtered = filtered.filter(university => university.address.province.provinceName === selectedLocation);
      }

      if (selectedField) {
        filtered = filtered.filter(
          university => university.fields && Array.isArray(university.fields) && university.fields.some(field => field.fieldName === selectedField)
        );
      }

      if (selectedType) {
        filtered = filtered.filter(university => {
          const type = university.universityType;
          switch (selectedType) {
            case 'Học viện':
              return type === 'ACADEMY';
            case 'Cao đẳng':
              return type === 'COLLEGE';
            case 'Đại học':
              return type === 'UNIVERSITY';
            case 'Khác':
              return type === 'OTHER';
            default:
              return true;
          }
        });
      }

      if (searchTerm) {
        filtered = filtered.filter(university => university.universityName.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredSchools(filtered);
      setCurrentPage(1);
    }
  }, [schoolsData, selectedLocation, selectedField, selectedType, searchTerm]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedSchools(filteredSchools.slice(start, end));
  }, [filteredSchools, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <form className="search-input absolute top-[-42px] flex w-full gap-[15px] rounded-2xl bg-primary-white p-[15px] shadow-lg">
          <div className="flex w-full items-center gap-[10px] rounded-[10px] bg-primary-light px-[20px] py-[15px] text-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Nhập tên trường học..."
              className="w-full border-none bg-transparent p-0 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
            {paginatedSchools.length
              ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredSchools.length)} trong ${filteredSchools.length} kết quả`
              : ''}
          </span>
          <div className="flex items-center gap-4">
            <SelectSearch label="Địa điểm" value={selectedLocation} items={locationItems} onChange={setSelectedLocation} width={150} />
            <SelectSearch label="Lĩnh vực" value={selectedField} items={fieldItems} onChange={setSelectedField} width={150} />
            <SelectSearch label="Loại trường" value={selectedType} items={typesItems} onChange={setSelectedType} width={180} />
          </div>
        </div>

        <div className="mt-[40px]">
          {isSchoolsLoading ? (
            <div className="my-[60px] flex w-full items-center justify-center">
              <Spin size="large" />
            </div>
          ) : paginatedSchools.length > 0 ? (
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {paginatedSchools.map(university => (
                <div
                  key={university.id}
                  className="item group flex flex-col items-center justify-start rounded-[10px] border-[1px] border-solid border-primary-border bg-primary-white p-[30px]">
                  <div className="university__icon mb-[20px] flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light">
                    <Image
                      src={university.logoUrl || '/images/default-logo.png'}
                      alt={university.universityName}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-2xl font-semibold text-primary-black">{university.universityName}</h4>
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

        {filteredSchools.length > pageSize && (
          <div className="mt-[80px] w-full">
            <Pagination current={currentPage} total={filteredSchools.length} align="center" pageSize={pageSize} onChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsList;
