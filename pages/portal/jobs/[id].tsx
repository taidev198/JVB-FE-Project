// pages/portal/companies/[id].tsx
import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  LaptopOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Alert } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import BreadCrumbHeaderDetail from '@/components/Portal/common/BreadCrumbHeaderDetail';
import HtmlContentRenderer from '@/components/Portal/common/HtmlContentRenderer';
import LinkCard from '@/components/Portal/common/LinkCard';
import GoogleMap from '@/components/Portal/common/MapCard';
import PortalLoadingLarge from '@/components/Portal/common/PortalLoadingLarge';
import PortalLayout from '@/layouts/portal/PortalLayout';
import { useGetJobDetailsQuery } from '@/services/portalHomeApi';
import { formatJobLevel, formatJobType, formatSalaryVND } from '@/utils/app/format';

interface JobDetailsProps {
  serverSideApiKeyIsSet: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useGetJobDetailsQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <PortalLayout type="job-detail">
        <PortalLoadingLarge />
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout type="job-detail">
        <Alert message="Error" description="Failed to load company details" type="error" showIcon />
      </PortalLayout>
    );
  }

  const jobDetails = data?.data;
  const address = `${jobDetails?.company?.address?.houseNumber}, ${jobDetails?.company?.address?.ward.wardName}, ${jobDetails?.company?.address?.district.districtName}, ${jobDetails?.company?.address?.province.provinceName}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=20&output=embed`;

  return (
    <>
      <Head>
        <title>JobLink - {jobDetails?.jobTitle}</title>
        <meta name="description" content={jobDetails?.jobTitle || 'Trang chi tiết công việc'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="company-list">
        <main>
          <BreadCrumbHeaderDetail
            title={jobDetails?.jobTitle || 'Tên công việc'}
            schoolType={jobDetails?.jobType ? formatJobType(jobDetails?.jobType) : 'Chưa xác định'}
            address={`${jobDetails?.company?.address?.houseNumber},${jobDetails?.company?.address?.ward.wardName}, ${jobDetails?.company?.address?.district.districtName}, ${jobDetails?.company?.address?.province.provinceName}`}
            logo={jobDetails?.company?.logoUrl}
            currentPage="Chi tiết công việc"
            buttonText="Ứng tuyển ngay"
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
                        <span className="block text-lg font-medium text-primary-black">Hạn ứng tuyển</span>
                        <span className="block text-primary-gray">{jobDetails?.expirationDate}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <TeamOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số người</span>
                        <span className="block text-primary-gray">{jobDetails?.memberOfCandidate}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <SolutionOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Trình độ</span>
                        <span className="block text-primary-gray">{jobDetails?.jobLevel && formatJobLevel(jobDetails?.jobLevel)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <LaptopOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Hình thức làm việc</span>
                        <span className="block text-primary-gray">{formatJobType(jobDetails?.jobType)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <ClockCircleOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Thời gian làm việc</span>
                        <span className="block text-primary-gray">{jobDetails?.workTime}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <DollarOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Mức lương</span>

                        <span className="block text-primary-gray">
                          {jobDetails?.salaryType === 'FIXED'
                            ? `${formatSalaryVND(jobDetails?.minSalary)} - ${formatSalaryVND(jobDetails?.maxSalary)}`
                            : 'Thỏa thuận'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about ">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Mô tả công việc</h3>
                  <div className="text-lg text-primary-gray">
                    <HtmlContentRenderer htmlContent={jobDetails?.jobDescription || ''} />
                  </div>
                </div>
                <div className="requires">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Mô tả công việc</h3>
                  <div className="text-lg text-primary-gray">
                    <HtmlContentRenderer htmlContent={jobDetails?.requirements || ''} />
                  </div>
                </div>
                <div className="benifits">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Quyền lợi</h3>
                  <div className="text-lg text-primary-gray">
                    <HtmlContentRenderer htmlContent={jobDetails?.benifits || ''} />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-[54px] lg:basis-5/12 xl:basis-4/12">
                <GoogleMap googleMapsUrl={googleMapsUrl} title="Vị trí trên Google Maps" height={300} />
                <LinkCard
                  logoUrl={jobDetails.company.logoUrl}
                  name={jobDetails.company.companyName}
                  shortDes={jobDetails.company.companyShortDescription}
                  websiteUrl={jobDetails.company.linkWebsite}
                />
              </div>
            </div>
          </div>
        </main>
      </PortalLayout>
    </>
  );
};

export default JobDetails;
