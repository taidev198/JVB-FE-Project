/* eslint-disable*/
// pages/portal/companies/[id].tsx
//
import { BookOutlined, CalendarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Input, Select } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

import ImageComponent from '@/components/Common/Image';
import PortalLayout from '@/layouts/portal/PortalLayout';
import { useGetCompanyDetailsQuery, useGetJobsCompanyQuery, useSendConnectMutation } from '@/services/portalHomeApi';
import { IJobByCompany } from '@/types/jobCompany';
import { formatJobType } from '@/utils/app/format';
import { useAppSelector } from '@/store/hooks';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import { BackDrop } from '@/components/Common/BackDrop';
import PortalLoadingLarge from '@/components/portal/common/PortalLoadingLarge';
import BreadCrumbHeaderDetail from '@/components/portal/common/BreadCrumbHeaderDetail';
import PortalLoading from '@/components/portal/common/PortalLoading';
import CustomPagination from '@/components/portal/common/CustomPagination';
import PortalEmpty from '@/components/portal/common/PortalEmpty';
import GoogleMap from '@/components/portal/common/MapCard';
import LinkCard from '@/components/portal/common/LinkCard';

interface CompanyDetailsPageProps {
  serverSideApiKeyIsSet: boolean;
}

const CompanyDetailsPage: React.FC<CompanyDetailsPageProps> = () => {
  const router = useRouter();
  const idLogin = useAppSelector(state => state.user.id);
  const nameUser = useAppSelector(state => state.user.name);
  const dispatch = useDispatch();

  const showBackdrop = useAppSelector(state => state.global.backdropType);

  const { id } = router.query;
  const { data, isLoading, error } = useGetCompanyDetailsQuery({ id: Number(id) });
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsCompanyQuery({ companyId: Number(id), page: 1, size: 1000 });
  const [sendRequests, { isLoading: sendRequestsLoading }] = useSendConnectMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedJobs, setPaginatedJobs] = useState<IJobByCompany[]>([]);
  const [pageSize, setPageSize] = useState(4);

  const { Option } = Select;

  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const triggerPageChange = (page: number) => {
    setFadeState('fade-out');
    setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      handlePageChange(page);
      setFadeState('fade-in');
    }, 300); // Matches the fade-out duration
  };

  useEffect(() => {
    dispatch(setLoading(sendRequestsLoading));
    if (jobsData?.data.content) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPaginatedJobs(jobsData.data.content.slice(startIndex, endIndex));
    } else {
      setPaginatedJobs([]);
    }
  }, [jobsData, currentPage, pageSize, dispatch, sendRequestsLoading]);

  if (isLoading) {
    return (
      <PortalLayout type="company-list">
        <PortalLoadingLarge />
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout type="company-list">
        <Alert message="Error" description="Failed to load company details" type="error" showIcon />
      </PortalLayout>
    );
  }

  const companyDetails = data?.data;
  const jobs: IJobByCompany[] = isLoadingJobs ? [] : jobsData?.data.content || [];

  const address = `${companyDetails?.address?.houseNumber}, ${companyDetails?.address?.ward.wardName}, ${companyDetails?.address?.district.districtName}, ${companyDetails?.address?.province.provinceName}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=20&output=embed`;

  const handleSendRequests = async () => {
    try {
      await sendRequests({ accountLoginId: idLogin, toDoAccountId: data.data.id, doBy: 0 }).unwrap();
      toast.success('Đã Gửi yêu cầu hợp tác thành công');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  }; 
  const [text, setText] = useState(`Xin chào, tôi là ${nameUser}. Tôi tìm thấy bạn qua website JobLink. Hợp tác với tôi nhé!`);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <Head>
        <title>JobLink - {companyDetails?.companyName}</title>
        <meta name="description" content={companyDetails?.companyShortDescription || 'Company details page'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="company-list">
        <main>
          <BreadCrumbHeaderDetail
            title={companyDetails?.companyName || 'Company Details'}
            schoolType={companyDetails?.companyShortDescription || 'Company details page'}
            address={`${companyDetails?.address?.houseNumber},${companyDetails?.address?.ward.wardName}, ${companyDetails?.address?.district.districtName}, ${companyDetails?.address?.province.provinceName}`}
            logo={companyDetails?.logoUrl}
            buttonText="Liên kết ngay"
            onButtonClick={() => dispatch(setBackdrop(BackdropType.AddModal))}
            currentPage="Trường học"
          />
          <div className="mp_section_padding">
            <div className="container mx-auto flex flex-col items-start gap-[30px] lg:flex-row">
              <div className="flex flex-col gap-[30px] lg:basis-7/12 xl:basis-8/12">
                <div className="overview rounded-[10px] bg-custom-gradient-1 p-[30px]">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Tổng quan về công ty</h3>
                  <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <CalendarOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Ngày thành lập</span>
                        <span className="block text-primary-gray">{companyDetails?.establishedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <TeamOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số lượng nhân viên</span>
                        <span className="block text-primary-gray">{companyDetails?.quantityEmployee}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <PhoneOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số điện thoại</span>
                        <span className="block text-primary-gray">{companyDetails?.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <EnvironmentOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Địa chỉ</span>
                        <span className="block text-primary-gray">{companyDetails?.address.province.provinceName}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <BookOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Mã công ty</span>
                        <span className="block text-primary-gray">{companyDetails?.companyCode}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <MailOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Email</span>
                        <span className="block text-primary-gray">{companyDetails.account?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about ">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Giới thiệu công ty</h3>
                  <p className="text-lg text-primary-gray">{companyDetails?.companyDescription}</p>
                </div>
                <div className="workshop">
                  <div className="mb-[20px] flex items-center justify-between">
                    <h3 className="text-[24px] font-semibold text-primary-black">Tin tuyển dụng</h3>

                    {jobs.length > 0 && (
                      <Select
                        value={pageSize}
                        onChange={value => {
                          setPageSize(value);
                          setCurrentPage(1);
                          setFadeState('fade-out');
                          setTimeout(() => {
                            setFadeState('fade-in');
                          }, 300);
                        }}
                        className="w-[120px]">
                        <Option value={4}>4 / trang</Option>
                        <Option value={5}>5 / trang</Option>
                        <Option value={10}>10 / trang</Option>
                        <Option value={20}>20 / trang</Option>
                      </Select>
                    )}
                  </div>
                  {isLoadingJobs ? (
                    <PortalLoading />
                  ) : jobs.length > 0 ? (
                    <>
                      <div className={`grid grid-cols-1 gap-[20px] transition-opacity duration-500 ${fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}>
                        {paginatedJobs?.map(job => (
                          <div key={job.id} className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                            <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center sm:gap-[33px]">
                              <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                                <ImageComponent src={companyDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                              </div>
                              <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                                <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                                  <h4 className="truncate text-[22px] font-semibold text-primary-black">{job.jobTitle}</h4>
                                  <p className="truncate text-lg text-primary-gray">{job.jobDescription}</p>
                                </div>
                                <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                                  <span className="flex items-center gap-1 ">
                                    <i className="fa-solid fa-briefcase"></i>
                                    <span className="truncate">{formatJobType(job.jobType)}</span>
                                  </span>
                                  <span className="flex items-center gap-1 truncate sm:w-full">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <span className="truncate ">
                                      {companyDetails?.address.province.provinceName}, {companyDetails?.address.district.districtName}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                              <Link
                                href={`/portal/jobs/${job.id}`}
                                className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px] text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                                <span className="">Xem chi tiết</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-[70px] w-full">
                        <CustomPagination total={jobs?.length} currentPage={currentPage} pageSize={pageSize} onChange={page => triggerPageChange(page)} />
                      </div>
                    </>
                  ) : (
                    <PortalEmpty />
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col gap-[54px] lg:basis-5/12 xl:basis-4/12">
                <GoogleMap googleMapsUrl={googleMapsUrl} title="Vị trí trên Google Maps" height={300} />
                <LinkCard
                  logoUrl={companyDetails.logoUrl}
                  name={companyDetails.companyName}
                  shortDes={companyDetails.companyShortDescription}
                  websiteUrl={companyDetails.linkWebsite}
                />
              </div>
            </div>
          </div>
          {showBackdrop === BackdropType.AddModal && (
            <BackDrop isCenter>
              <div className="max-w-[480px] rounded-md p-6">
                <h3 className="font-bold">{showBackdrop === BackdropType.AddModal && `Thư hợp tác đến ${companyDetails.companyName}`}</h3>
                <p className="mb-3 mt-1">Bạn có chắc muốn thực hiện hành động này</p>
                <div className="flex items-center justify-center">
                  <div className="w-full grid grid-cols-1 gap-4 rounded-lg bg-primary-white pt-4">
                    <div className="relative w-full">
                      <Input.TextArea
                        value={text}
                        onChange={handleChange}
                        maxLength={150}
                        rows={5}
                        style={{ resize: 'none' }}
                      />
                      <span className="absolute bottom-2 right-3 text-gray-500">
                        {text.length}/150 ký tự
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-9 flex items-center gap-5">
                  <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
                  <Button text="Xác nhận" full={true} onClick={handleSendRequests} />
                </div>
              </div>
            </BackDrop>
          )}
        </main>
      </PortalLayout>
    </>
  );
};

export default CompanyDetailsPage;
