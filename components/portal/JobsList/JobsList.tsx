import React, { useState, useEffect, useCallback } from 'react';
import { Pagination, Spin, Empty, Form, Input, Checkbox, Button, Space, DatePicker, ConfigProvider, Divider } from 'antd';
import {
  AppstoreOutlined,
  BarsOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  SearchOutlined,
  TagOutlined,
  TeamOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import SelectSearch from '../common/SelectSearch';
import { useGetProvincesQuery, useGetFieldsQuery, useGetSchoolsQuery, useGetWorkshopsQuery, useGetJobsQuery } from '@/services/portalHomeApi';
import { IUniversity } from '@/types/university';
import Select from 'rc-select';
import { formatCurrencyVND, formatDateDD_thang_MM_yyyy, formatJobType } from '@/utils/app/format';
import { IJobCompany } from '@/types/jobCompany';
import CustomImage from '../common/CustomImage';

const WorkshopsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<IJobCompany[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedJobs, setPaginatedJobs] = useState<IJobCompany[]>([]);
  const pageSize = 8;
  const [form] = Form.useForm();

  const [locations] = useState<string[]>(['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng']); // Example location options
  const [topics] = useState<string[]>(['Marketing', 'Design', 'Coding', 'Business']); // Example topic options

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery({
    page: 1,
    size: 1000,
    keyword: searchTerm,
  });

  useEffect(() => {
    if (jobsData?.data.content) {
      let filtered = jobsData.data.content;

      if (selectedField) {
        filtered = filtered.filter(
          university => university.fields && Array.isArray(university.fields) && university.fields.some(field => field.fieldName === selectedField)
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(university => university.universityName.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      setFilteredJobs(filtered);
      setCurrentPage(1);
    }
  }, [jobsData, selectedField, selectedType, searchTerm]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedJobs(filteredJobs.slice(start, end));
  }, [filteredJobs, currentPage]);

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
                <h2 className="mb-[16px] text-xl font-semibold">Tìm Kiếm Workshop</h2>
                <Form.Item name="workshopName">
                  <Input prefix={<SearchOutlined className="mr-[4px]" />} size="large" className="w-full" placeholder="Nhập tên workshop" />
                </Form.Item>
                <Form.Item name="location" label="Địa điểm">
                  <SelectSearch
                    icon={<EnvironmentOutlined className="mr-[4px]" />}
                    label="Chọn địa điểm"
                    value={null}
                    items={locations}
                    onChange={selected => form.setFieldsValue({ location: selected })}
                  />
                </Form.Item>

                <Form.Item name="topic" label="Ngành nghề">
                  <SelectSearch
                    icon={<TagOutlined className="mr-[4px]" />}
                    label="Chọn ngành nghề"
                    value={null}
                    items={topics}
                    onChange={selected => form.setFieldsValue({ topic: selected })}
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
                <Form.Item name="format" label="Hình thức">
                  <Space direction="vertical" size={0} className="w-full">
                    <Checkbox name="online" className="w-full  py-[14px]">
                      Full Time
                    </Checkbox>
                    <Checkbox name="online" className="w-full border-t border-primary-border py-[14px]">
                      Part Time
                    </Checkbox>
                    <Checkbox name="online" className="w-full border-t border-primary-border py-[14px]">
                      Freelance
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
                      <div
                        key={job.id}
                        className="rts__job__card mp_transition_4 group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[10px] border-[1px] border-solid border-primary-border p-[30px] hover:border-transparent 2xl:p-[40px]">
                        <div className="background mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient group-hover:opacity-100"></div>
                        <div className="company__icon mp_transition_4 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary-light group-hover:bg-primary-white">
                          <CustomImage
                            src={job.company.logoUrl || '/images/user-default.png'}
                            alt={job.company.companyName}
                            className="h-10 w-10"
                            width={40}
                            height={40}
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
                        <div className="my-4 text-2xl font-bold text-primary-black">
                          <a href={`/jobs/${job.id}`} aria-label="job">
                            {job.jobTitle}
                          </a>
                        </div>
                        <p className="mp_p">{job.jobDescription}</p>
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
                      </div>
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
              <Pagination current={currentPage} total={filteredJobs.length} align="center" pageSize={pageSize} onChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WorkshopsList;
