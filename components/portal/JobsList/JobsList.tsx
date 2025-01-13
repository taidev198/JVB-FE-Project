/* eslint-disable react-hooks/exhaustive-deps */
import { AppstoreOutlined, BarsOutlined, EnvironmentOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, Form, Input, InputNumber, Pagination, Spin } from 'antd';
import Link from 'next/link';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import SelectSearch from '../common/SelectSearch';
import HtmlContentRenderer from '../common/HtmlContentRenderer';
import SelectTypeSearch from './SelectTypeSearch';
import { formatCurrencyVND, formatJobType } from '@/utils/app/format';
import { useGetFieldsQuery, useGetJobsQuery, useGetProvincesQuery } from '@/services/portalHomeApi';
import ImageComponent from '@/components/Common/Image';
import { useAppSelector } from '@/store/hooks';

const jobTypeMap = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  FREELANCER: 'FREELANCER',
};

const salaryTypeMap = [
  {
    label: 'Thỏa thuận',
    value: 'NEGOTIABLE',
  },
  {
    label: 'Cố định',
    value: 'FIXED',
  },
];

const jobLevelMap = {
  INTERN: 'INTERN',
  FRESHER: 'FRESHER',
  JUNIOR: 'JUNIOR',
  MIDDLE: 'MIDDLE',
  SENIOR: 'SENIOR',
};

const JobsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [detailedView, setDetailedView] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // Initial page size
  const [form] = Form.useForm();

  const idUser = useAppSelector(state => state.user.id);

  const [jobType, setJobType] = useState<string | null>(null);
  const [jobLevel, setJobLevel] = useState<string | null>(null);

  const [salaryType, setSalaryType] = useState<string | null>(null);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalaryDebounce, setMaxSalaryDebounce] = useState<number | null>(null);
  const [minSalaryDebounce, setMinSalaryDebounce] = useState<number | null>(null);

  const { data: provincesData, isLoading: isProvincesLoading } = useGetProvincesQuery();
  const { data: fieldsData, isLoading: isFieldsLoading } = useGetFieldsQuery();
  const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery(
    {
      page: currentPage,
      size: pageSize,
      keyword: searchTerm,
      provinceId: selectedLocation ? provincesData?.data.find(province => province.provinceName === selectedLocation)?.id : undefined,
      fieldId: selectedField ? fieldsData?.data.find(field => field.fieldName === selectedField)?.id : undefined,
      jobType,
      salaryType,
      jobLevel,
      maxSalary: maxSalaryDebounce,
      minSalary: minSalaryDebounce,
      universityId: idUser,
    },
    { refetchOnMountOrArgChange: true }
  );

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

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handleSalarySubmit = () => {
    setMinSalaryDebounce(minSalary);
    setMaxSalaryDebounce(maxSalary);
  };

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

  const handleSalaryType = (value: string) => {
    setSalaryType(value);
    if (salaryType !== 'FIXED') {
      setMinSalary(null);
      setMaxSalary(null);
    }
    form.resetFields(['minSalary', 'maxSalary']);
  };

  const isSalaryValid = minSalary !== undefined && maxSalary !== undefined && minSalary > 0 && maxSalary > 0 && minSalary < maxSalary;

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
          <div className="mt-[20px] block items-start justify-center gap-[30px] lg:flex">
            <div className="mb-[40px] min-w-[375px] max-w-[390px] rounded-[10px] bg-custom-gradient p-[30px]">
              <Form form={form} layout="vertical" onFinish={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-[16px] text-xl font-semibold">Tìm kiếm công việc </h2>
                <Form.Item name="jobName">
                  <Input
                    prefix={<SearchOutlined className="mr-[4px]" />}
                    size="large"
                    className="w-full"
                    placeholder="Nhập tên công việc"
                    value={searchTerm}
                    onChange={e => debouncedSearch(e.target.value)}
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
                <Form.Item name="jobLevel" label="Cấp bậc công việc">
                  <SelectSearch
                    icon={<TagOutlined className="mr-[4px]" />}
                    label="Chọn cấp bậc công việc"
                    value={jobLevel}
                    items={Object.keys(jobLevelMap)}
                    onChange={setJobLevel}
                  />
                </Form.Item>

                <Form.Item name="jobType" label="Hình thức làm việc">
                  <SelectSearch
                    icon={<TagOutlined className="mr-[4px]" />}
                    label="Chọn hình thức làm việc"
                    value={jobType}
                    items={Object.keys(jobTypeMap)}
                    onChange={setJobType}
                  />
                </Form.Item>

                <Form.Item name="salaryType" label="Mức lương">
                  <SelectTypeSearch
                    icon={<TagOutlined className="mr-[4px]" />}
                    label="Chọn loại lương"
                    value={salaryType}
                    items={salaryTypeMap}
                    onChange={handleSalaryType}
                  />
                </Form.Item>

                {salaryType === 'FIXED' && (
                  <>
                    <div className="flex justify-center gap-4">
                      <Form.Item className="w-[50%]" name="minSalary">
                        <InputNumber
                          size="large"
                          className={`w-full ${minSalary >= maxSalary ? 'border-red-400 hover:border-red-400' : ''}`}
                          placeholder="Từ"
                          value={minSalary}
                          onChange={value => setMinSalary(value)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <span>-</span>
                      </Form.Item>
                      <Form.Item className="w-[50%]" name="maxSalary">
                        <InputNumber
                          size="large"
                          className={`w-full ${minSalary >= maxSalary ? 'border-red-400 hover:border-red-400' : ''}`}
                          placeholder="Đến"
                          value={maxSalary}
                          onChange={value => setMaxSalary(value)}
                        />
                      </Form.Item>
                    </div>
                    <button
                      className={
                        'mp_transition_4 flex h-[40px] items-center justify-center gap-2 rounded-[6px] border-[1px] border-solid px-4 ' +
                        (isSalaryValid
                          ? 'border-primary-main bg-primary-main text-white'
                          : 'pointer-events-none cursor-not-allowed bg-primary-light text-primary-gray')
                      }
                      onClick={isSalaryValid ? handleSalarySubmit : undefined}
                      disabled={!isSalaryValid}>
                      <span>Áp dụng</span>
                    </button>
                  </>
                )}

                {/*<Form.Item name="time" label="Thời gian">
                  <DatePicker
                    prefix={<HistoryOutlined className="mr-[4px]" />}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày đăng bài"
                    className="w-full "
                    size="large"
                  />
                </Form.Item>*/}
              </Form>
            </div>
            <div className="md:basis-2/3">
              <div className=" flex items-center justify-between">
                <span className="hidden font-medium text-primary-black md:block">
                  {jobsData?.data?.content?.length
                    ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, jobsData?.data.totalElements)} trong ${
                        jobsData?.data.totalElements
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
                    <span>Danh sách</span>
                  </div>
                </div>
              </div>

              <div className="mt-[40px]">
                {isJobsLoading ? (
                  <div className="flex w-full items-center justify-center">
                    <Spin size="large" />
                  </div>
                ) : jobsData?.data.content.length > 0 ? (
                  detailedView ? (
                    <div className="grid grid-cols-1 gap-[30px]">
                      {jobsData.data.content.map(job => (
                        <div
                          key={job.id}
                          className="rts__single__blog mp_transition_4 group relative flex h-full w-full flex-row  gap-[20px] overflow-hidden rounded-[10px] border-[1px] border-primary-border bg-primary-white px-[24px] py-[30px] pt-[24px] hover:border-transparent hover:bg-transparent">
                          <div className="mp_transition_4 absolute inset-0 z-[-1] bg-transparent opacity-0 group-hover:bg-custom-gradient-1 group-hover:opacity-100"></div>
                          <Link
                            href={`/portal/workshops/${job.id}`}
                            className="blog__img flex-shrink-0 rounded-[10px] bg-primary-light group-hover:bg-primary-white">
                            <ImageComponent
                              src={job.company.logoUrl}
                              alt={job.jobTitle}
                              className="aspect-square max-h-[240px] w-full overflow-hidden rounded-[10px] object-contain px-4"
                            />
                          </Link>
                          <div className="flex w-full flex-col">
                            <Link href={`/portal/jobs/${job.id}`} className="block truncate whitespace-nowrap text-[24px] font-semibold text-primary-black ">
                              {job.jobTitle}
                            </Link>
                            <div className="blog__meta w-full pt-[16px] ">
                              <div className="blog__meta__info mb-[16px] flex w-full items-center gap-4 text-primary-gray">
                                <span className="flex items-center gap-1 truncate">
                                  <i className="fa-solid fa-user"></i>
                                  <span className=" truncate whitespace-nowrap">{job.company.companyName}</span>
                                </span>
                              </div>
                              <div className="readmore__btn flex items-center gap-1 truncate text-primary-gray">
                                <i className="fa-solid fa-location-dot mp_transition_4" />
                                <span className="mp_transition_4 truncate whitespace-nowrap font-medium">
                                  {job.company.address.province.provinceName}, {job.company.address.district.districtName}
                                </span>
                              </div>
                            </div>
                            <div className="mt-[16px] line-clamp-2 text-lg text-primary-gray">
                              <HtmlContentRenderer htmlContent={job?.jobDescription || ''} />
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                              <div className="jobs__tags flex items-center gap-4 ">
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
                              <Link href={`/portal/jobs/${job.id}`} className="readmore__btn mf-2 mr-2 flex items-center gap-2 text-lg">
                                <span className="mp_transition_4 font-medium hover:text-primary-main">Chi tiết</span>
                                <i className="fa-solid fa-arrow-right mp_transition_4 rotate-[-40deg] group-hover:rotate-0 group-hover:text-primary-main" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-2">
                      {jobsData.data.content.map(job => (
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
                            <div aria-label="job" className="line-clamp-2">
                              {job.jobTitle}
                            </div>
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
                  )
                ) : (
                  <div className="flex w-full items-center justify-center">
                    <Empty description="Không có dữ liệu" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {jobsData && (
            <div className="mt-[80px] w-full">
              <Pagination
                current={currentPage}
                total={jobsData?.data.totalElements}
                pageSize={pageSize}
                showSizeChanger
                align="center"
                pageSizeOptions={['8', '10', '20', '50', '100']}
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
