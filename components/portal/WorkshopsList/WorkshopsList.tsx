import { useGetFieldsQuery, useGetProvincesQuery, useGetWorkshopsQuery } from '@/services/portalHomeApi';
import { IWorkshopPortal } from '@/types/workshop';
import { formatDateDD_thang_MM_yyyy } from '@/utils/app/format';
import { AppstoreOutlined, BarsOutlined, EnvironmentOutlined, HistoryOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Checkbox, ConfigProvider, DatePicker, Empty, Form, Input, Pagination, Space, Spin } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import SelectSearch from '../common/SelectSearch';
import PortalLoading from '../common/PortalLoading';
import PortalEmpty from '../common/PortalEmpty';

const WorkshopsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [detailedView, setDetailedView] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredWorkshops, setFilteredWorkshops] = useState<IWorkshopPortal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedWorkshops, setPaginatedWorkshops] = useState<IWorkshopPortal[]>([]);
  const [pageSize, setPageSize] = useState(8); // Initial page size
  const [form] = Form.useForm();

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: workshopsData, isLoading: isWorkshopsLoading } = useGetWorkshopsQuery({
    page: 1,
    size: 1000,
    keyword: searchTerm,
  });

  useEffect(() => {
    if (workshopsData?.data.content) {
      let filtered = workshopsData.data.content;

      if (selectedLocation) {
        filtered = filtered.filter(workshop => workshop.address.province.provinceName === selectedLocation);
      }

      if (selectedField) {
        filtered = filtered.filter(
          workshop => workshop.fields && Array.isArray(workshop.fields) && workshop.fields.some(field => field.fieldName === selectedField)
        );
      }

      if (selectedDate) {
        filtered = filtered.filter(workshop => new Date(workshop.startTime) > selectedDate);
      }

      if (searchTerm) {
        filtered = filtered.filter(workshop => workshop.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredWorkshops(filtered);
      setCurrentPage(1);
    }
  }, [workshopsData, selectedField, selectedLocation, selectedDate, searchTerm]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedWorkshops(filteredWorkshops.slice(start, end));
  }, [filteredWorkshops, currentPage, pageSize]);

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
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBgContainer: '#FFFFFF', // Override the background color
          },
        },
      }}>
      <div className="rts__section">
        <div className="mp_section_padding container relative mx-auto">
          <div className="mt-[20px] flex items-start justify-center gap-[30px]">
            <div className="mb-[40px] hidden min-w-[375px]  max-w-[390px] rounded-[10px] bg-custom-gradient p-[30px] md:block">
              <Form form={form} layout="vertical" onFinish={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-[16px] text-xl font-semibold">Tìm kiếm workshop</h2>
                <Form.Item name="workshopName">
                  <Input
                    prefix={<SearchOutlined className="mr-[4px]" />}
                    size="large"
                    className="w-full"
                    placeholder="Nhập tên workshop"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name="location" label="Địa điểm">
                  <SelectSearch
                    icon={<EnvironmentOutlined className="mr-[4px]" />}
                    label="Chọn địa điểm"
                    value={selectedLocation}
                    items={locationItems}
                    onChange={setSelectedLocation}
                  />
                </Form.Item>

                <Form.Item name="topic" label="Ngành nghề">
                  <SelectSearch
                    icon={<TagOutlined className="mr-[4px]" />}
                    label="Chọn ngành nghề"
                    value={selectedField}
                    items={fieldItems}
                    onChange={setSelectedField}
                  />
                </Form.Item>

                <Form.Item name="time" label="Thời gian">
                  <DatePicker
                    prefix={<HistoryOutlined className="mr-[4px]" />}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày đăng bài"
                    className="w-full"
                    size="large"
                    onChange={date => setSelectedDate(date?.toDate() || null)}
                  />
                </Form.Item>
                <Form.Item name="format" label="Hình thức">
                  <Space direction="vertical" size={0} className="w-full">
                    <Checkbox name="online" className="w-full  py-[14px]">
                      Trực tuyến (Online)
                    </Checkbox>
                    <Checkbox name="online" className="w-full border-t border-primary-border py-[14px]">
                      Trực tiếp (Offline)
                    </Checkbox>
                    <Checkbox name="online" className="w-full border-t border-primary-border py-[14px]">
                      Kết hợp
                    </Checkbox>
                  </Space>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" className="w-full">
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="md:basis-2/3">
              <div className=" flex items-center justify-between">
                <span className="hidden font-medium text-primary-black md:block">
                  {paginatedWorkshops.length
                    ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredWorkshops.length)} trong ${
                        filteredWorkshops.length
                      } kết quả`
                    : ''}
                </span>
                <div className="flex items-center gap-4">
                  <div
                    className={
                      'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main px-4 text-primary-main hover:bg-primary-main hover:text-white ' +
                      (!detailedView ? 'bg-primary-main text-white' : '')
                    }
                    onClick={() => {
                      setDetailedView(false);
                    }}>
                    <AppstoreOutlined />
                    <span>Lưới</span>
                  </div>

                  <div
                    className={
                      'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main px-4 text-primary-main hover:bg-primary-main hover:text-white ' +
                      (detailedView ? 'bg-primary-main text-white' : '')
                    }
                    onClick={() => {
                      setDetailedView(true);
                    }}>
                    <BarsOutlined />
                    <span>Chi tiết</span>
                  </div>
                </div>
              </div>

              <div className="mt-[40px]">
                {isWorkshopsLoading ? (
                  <PortalLoading />
                ) : paginatedWorkshops.length > 0 ? (
                  detailedView ? (
                    <div className="grid grid-cols-1 gap-[30px] ">
                      {paginatedWorkshops.map(workshop => (
                        <div
                          key={workshop.id}
                          className="rts__single__blog mp_transition_4 group relative flex h-full w-full flex-row  gap-[20px] overflow-hidden rounded-[10px] border-[1px] border-primary-border bg-primary-white px-[24px] py-[30px] pt-[24px] hover:border-transparent hover:bg-transparent">
                          <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
                          <Link href={`/portal/workshops/${workshop.id}`} className="blog__img">
                            <img
                              src={workshop.imageWorkshops || '/images/default-workshop.png'}
                              className="vertical-center min-h-[240px] max-w-[360px] max-w-full overflow-hidden rounded-[10px] object-cover"
                              alt={workshop.workshopTitle}
                            />
                          </Link>
                          <div className="flex w-full flex-col">
                            <Link
                              href={`/portal/workshops/${workshop.id}`}
                              className="block truncate whitespace-nowrap text-[24px] font-semibold text-primary-black ">
                              {workshop.workshopTitle}
                            </Link>
                            <div className="blog__meta pt-[16px]">
                              <div className="blog__meta__info mb-[16px] flex items-center gap-4 text-primary-gray">
                                <span className="flex items-center gap-1 ">
                                  <i className="fa-solid fa-calendar"></i>
                                  <span className="truncate whitespace-nowrap">{formatDateDD_thang_MM_yyyy(workshop.startTime)}</span>
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <i className="fa-solid fa-user"></i>
                                  <span className="truncate whitespace-nowrap">{workshop.university.universityName}</span>
                                </span>
                              </div>
                              <div className="readmore__btn flex items-center gap-1 truncate text-primary-gray">
                                <i className="fa-solid fa-location-dot mp_transition_4" />
                                <span className="mp_transition_4 truncate whitespace-nowrap font-medium">
                                  {workshop.address.province.provinceName}, {workshop.address.district.districtName}
                                </span>
                              </div>
                            </div>
                            <p className="mt-[16px] line-clamp-2 text-lg text-primary-gray">{workshop.workshopDescription}</p>
                            <div className="absolute bottom-[30px] right-[24px] flex items-center justify-end ">
                              <Link href={`/portal/workshops/${workshop.id}`} className="readmore__btn mf-2 mr-2 flex items-center gap-2 text-lg">
                                <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                                <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-[30px] md:grid-cols-1 xl:grid-cols-2 ">
                      {paginatedWorkshops.map(workshop => (
                        <div
                          key={workshop.id}
                          className="rts__single__blog mp_transition_4 group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[10px] border-[1px] border-primary-border bg-primary-white px-[24px] py-[30px] pt-[24px] hover:border-transparent hover:bg-transparent">
                          <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
                          <Link href={`/portal/workshops/${workshop.id}`} className="blog__img">
                            <img
                              src={workshop.imageWorkshops || '/images/default-workshop.png'}
                              className="vertical-center mb-2 min-h-[240px] max-w-full overflow-hidden rounded-[10px] object-cover"
                              alt={workshop.workshopTitle}
                            />
                          </Link>
                          <div className="blog__meta pt-[16px]">
                            <div className="blog__meta__info mb-[16px] flex items-center justify-between gap-4 text-primary-gray">
                              <span className="flex items-center gap-1 ">
                                <i className="fa-solid fa-calendar"></i>
                                <span className="truncate whitespace-nowrap">{formatDateDD_thang_MM_yyyy(workshop.startTime)}</span>
                              </span>
                              <span className="flex items-center gap-1 truncate">
                                <i className="fa-solid fa-user"></i>
                                <span className="truncate whitespace-nowrap">{workshop.university.universityName}</span>
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/portal/workshops/${workshop.id}`}
                            className="block truncate whitespace-nowrap text-[24px] font-semibold text-primary-black ">
                            {workshop.workshopTitle}
                          </Link>
                          <p className="mt-[16px] line-clamp-2 text-lg text-primary-gray">{workshop.workshopDescription}</p>
                          <div className="mt-[20px] flex flex-row items-center justify-between ">
                            <Link href={`/portal/workshops/${workshop.id}`} className="readmore__btn flex basis-1/2 items-center gap-2 text-lg">
                              <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                              <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                            </Link>
                            <div className="readmore__btn flex basis-1/2 items-center gap-2 truncate text-lg  ">
                              <i className="fa-solid fa-location-dot mp_transition_4 text-primary-main" />
                              <span className="mp_transition_4 truncate whitespace-nowrap font-medium hover:text-primary-main">
                                {workshop.address.province.provinceName}, {workshop.address.district.districtName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <PortalEmpty />
                )}
              </div>
            </div>
          </div>
          {filteredWorkshops.length > pageSize && (
            <div className="mt-[80px] w-full">
              <Pagination
                current={currentPage}
                total={filteredWorkshops.length}
                pageSize={pageSize}
                showSizeChanger
                align="center"
                onChange={handlePageChange}
                onShowSizeChange={(_, size) => handlePageChange(1, size)} // Reset to first page on size change
              />
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WorkshopsList;
