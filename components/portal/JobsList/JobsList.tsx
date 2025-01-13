/* eslint-disable react-hooks/exhaustive-deps */
import { AppstoreOutlined, BarsOutlined, EnvironmentOutlined, HistoryOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import { ConfigProvider, DatePicker, Empty, Form, Input, Pagination, Spin } from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SelectSearch from '../common/SelectSearch';
import { formatCurrencyVND, formatJobType } from '@/utils/app/format';
import { IJobCompany } from '@/types/jobCompany';
import { useGetFieldsQuery, useGetJobsQuery, useGetProvincesQuery } from '@/services/portalHomeApi';
import ImageComponent from '@/components/Common/Image';

const JobsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedType] = useState<string | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<IJobCompany[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedJobs, setPaginatedJobs] = useState<IJobCompany[]>([]);
  const [pageSize, setPageSize] = useState(8); // Initial page size
  const [form] = Form.useForm();

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery({
    page: 1,
    size: 1000,
    keyword: searchTerm,
  });

  const router = useRouter();
  const { location, field } = router.query;

  useEffect(() => {
    if (location) {
      setSelectedLocation(location as string);
      form.setFieldsValue({ location });
    }
    if (field) {
      setSelectedField(field as string);
      form.setFieldsValue({ topic: field });
    }
  }, [location, field, form]);

  useEffect(() => {
    if (jobsData?.data.content) {
      let filtered = jobsData.data.content;

      if (selectedLocation) {
        filtered = filtered.filter(job => job.company.address.province.provinceName === selectedLocation);
      }

      if (selectedField) {
        filtered = filtered.filter(job => job.fields && Array.isArray(job.fields) && job.fields.some(field => field.fieldName === selectedField));
      }

      if (searchTerm) {
        filtered = filtered.filter(job => job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredJobs(filtered);
      setCurrentPage(1);
    }
  }, [jobsData, selectedField, selectedLocation, selectedType, searchTerm]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedJobs(filteredJobs.slice(start, end));
  }, [filteredJobs, currentPage, pageSize]);

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
          <div className="mt-[20px] flex items-start gap-[30px]">
            <div className="mb-[40px] min-w-[375px] max-w-[390px] rounded-[10px] bg-custom-gradient p-[30px]">
              <Form form={form} layout="vertical" onFinish={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-[16px] text-xl font-semibold">Tìm kiếm công việc test conflict</h2>
                <Form.Item name="jobName">
                  <Input
                    prefix={<SearchOutlined className="mr-[4px]" />}
                    size="large"
                    className="w-full"
                    placeholder="Nhập tên công việc"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name="location" label="Địa điểm" initialValue={location}>
                  <SelectSearch
                    icon={<EnvironmentOutlined className="mr-[4px]" />}
                    label="Chọn địa điểm"
                    value={selectedLocation}
                    items={locationItems}
                    onChange={setSelectedLocation}
                  />
                </Form.Item>

                <Form.Item name="topic" label="Ngành nghề" initialValue={field}>
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
                    className="w-full "
                    size="large"
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="basis-2/3">
              <div className=" flex items-center justify-between">
                <span className="hidden font-medium text-primary-black md:block">
                  {paginatedJobs.length
                    ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredJobs.length)} trong ${filteredJobs.length} kết quả`
                    : ''}
                </span>
                <div className="flex items-center gap-4">
                  <div className=" flex h-[40px] items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main bg-primary-main px-4 text-primary-white ">
                    <AppstoreOutlined />
                    <span>Lưới</span>
                  </div>
                  <div className="flex h-[40px] items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main px-4 text-primary-main">
                    <BarsOutlined />
                    <span>Chi tiết</span>
                  </div>
                </div>
              </div>

              <div className="mt-[40px]">
                {isJobsLoading ? (
                  <div className="flex w-full items-center justify-center">
                    <Spin size="large" />
                  </div>
                ) : paginatedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2 ">
                    {paginatedJobs.map(job => (
                      <Link
                        href={`/portal/jobs/${job.id}`}
                        key={job.id}
                        className="rts__job__card mp_transition_4 group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[10px] border-[1px] border-solid border-primary-border p-[30px] hover:border-transparent 2xl:p-[40px]">
                        <div className="background mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient group-hover:opacity-100"></div>
                        <div className="company__icon mp_transition_4 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light group-hover:bg-primary-white">
                          <ImageComponent
                            src={job.company.logoUrl || '/images/user-default.png'}
                            alt={job.company.companyName}
                            className="aspect-square h-10 w-10 object-contain"
                            width={50}
                            height={50}
                          />
                        </div>
                        <div className="mt-6 flex items-center gap-4 text-lg text-primary-gray">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-location-dot" /> {job.company.address.province.provinceName}
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-briefcase" />
                            <span className="">{formatJobType(job.jobType)}</span>
                          </div>
                        </div>
                        <div className="my-4 line-clamp-2 text-2xl font-bold text-primary-black">
                          <Link href={`/portal/jobs/${job.id}`} aria-label="job" className="line-clamp-2">
                            {job.jobTitle}
                          </Link>
                        </div>
                        <p className="mp_p line-clamp-2">{job.jobDescription}</p>
                        <div className="jobs__tags mt-6 flex items-center gap-4 ">
                          <span className="job__tag rounded-md bg-primary-light px-[12px] py-[8px] font-medium capitalize text-primary-gray">
                            {job.minSalary && job.maxSalary
                              ? `${formatCurrencyVND(job.minSalary)} - ${formatCurrencyVND(job.maxSalary)}`
                              : job.minSalary
                              ? formatCurrencyVND(job.minSalary)
                              : job.maxSalary
                              ? formatCurrencyVND(job.maxSalary)
                              : 'Thỏa thuận'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center">
                    <Empty description="Không có dữ liệu" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {filteredJobs.length > pageSize && (
            <div className="mt-[80px] w-full">
              <Pagination
                current={currentPage}
                total={filteredJobs.length}
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

export default JobsList;
