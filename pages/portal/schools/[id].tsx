// pages/portal/schools/[id].tsx

import { BookOutlined, CalendarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Spin } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ImageComponent from '@/components/Common/Image';
import BreadCrumbHeaderDetail from '@/components/Portal/common/BreadCrumbHeaderDetail';
import LinkCard from '@/components/Portal/common/LinkCard';
import GoogleMap from '@/components/Portal/common/MapCard';
import PortalLayout from '@/layouts/Portal/PortalLayout';
import { useGetCompanyDetailsQuery, useGetSchoolDetailsQuery } from '@/services/portalHomeApi';
import { convertSchoolType } from '@/utils/app/format';
interface SchoolDetailsPageProps {
  serverSideApiKeyIsSet: boolean;
}

const SchoolDetailsPage: React.FC<SchoolDetailsPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } = useGetSchoolDetailsQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <PortalLayout type="company-list">
        <Spin tip="Loading school details..." />
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout type="company-list">
        <Alert message="Error" description="Failed to load school details" type="error" showIcon />
      </PortalLayout>
    );
  }

  const schoolDetails = data?.data;

  const address = `${schoolDetails?.address?.houseNumber}, ${schoolDetails?.address?.ward.wardName}, ${schoolDetails?.address?.district.districtName}, ${schoolDetails?.address?.province.provinceName}`;
  const zoomLevel = 20; // Độ zoom, từ 1 đến 21
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=${zoomLevel}&output=embed`;

  return (
    <>
      <Head>
        <title>JobLink - {schoolDetails?.universityName}</title>
        <meta name="description" content={schoolDetails?.universityShortDescription || 'University details page'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="company-list">
        <main>
          <BreadCrumbHeaderDetail
            title={schoolDetails?.universityName || 'Company Details'}
            schoolType={convertSchoolType(schoolDetails?.universityType || '')}
            address={`${schoolDetails?.address?.houseNumber},${schoolDetails?.address?.ward.wardName}, ${schoolDetails?.address?.district.districtName}, ${schoolDetails?.address?.province.provinceName}`}
            logo={schoolDetails?.logoUrl}
            currentPage="Trường học"
          />
          <div className="mp_section_padding">
            <div className="container mx-auto flex flex-col items-start gap-[30px] lg:flex-row">
              <div className="flex flex-col gap-[30px] lg:basis-7/12 xl:basis-8/12">
                <div className="overview rounded-[10px] bg-custom-gradient-1 p-[30px]">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Tổng quan về trường học</h3>
                  <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <CalendarOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Ngày thành lập</span>
                        <span className="block text-primary-gray">{schoolDetails?.establishedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <TeamOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số lượng sinh viên</span>
                        <span className="block text-primary-gray">{schoolDetails?.numberOfStudents}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <PhoneOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số điện thoại</span>
                        <span className="block text-primary-gray">{schoolDetails?.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <EnvironmentOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Địa chỉ</span>
                        <span className="block text-primary-gray">{schoolDetails?.address.province.provinceName}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <BookOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Mã trường học</span>
                        <span className="block text-primary-gray">{schoolDetails?.universityCode}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <MailOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Email</span>
                        <span className="block text-primary-gray">{schoolDetails.account?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about ">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Giới thiệu trường học</h3>
                  <p className="text-lg text-primary-gray">{schoolDetails?.universityDescription}</p>
                </div>
                <div className="workshop">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Danh sách workshop</h3>
                  <div className="grid grid-cols-1 gap-[20px]">
                    <div className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                      <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center  sm:gap-[33px]">
                        <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                          <ImageComponent src={schoolDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                        </div>

                        <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                          <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                            <h4 className="truncate text-[22px] font-semibold text-primary-black">
                              Workshop 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                            </h4>
                            <p className="truncate text-lg text-primary-gray">Mô tả wokshop</p>
                          </div>
                          <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                            <span className="flex items-center gap-1 ">
                              <i className="fa-solid fa-calendar"></i>
                              <span className="truncate">12, tháng 10, 2024</span>
                            </span>
                            <span className="flex items-center  gap-1 truncate sm:w-full">
                              <i className="fa-solid fa-location-dot"></i>
                              <span className="truncate ">Quảng bình, Huyện Quang Trị</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                        <Link
                          href={`/workshops`}
                          className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px]  text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                          <span className="">Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                    <div className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                      <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center  sm:gap-[33px]">
                        <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                          <ImageComponent src={schoolDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                        </div>

                        <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                          <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                            <h4 className="truncate text-[22px] font-semibold text-primary-black">
                              Workshop 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                            </h4>
                            <p className="truncate text-lg text-primary-gray">Mô tả wokshop</p>
                          </div>
                          <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                            <span className="flex items-center gap-1 ">
                              <i className="fa-solid fa-calendar"></i>
                              <span className="truncate">12, tháng 10, 2024</span>
                            </span>
                            <span className="flex items-center  gap-1 truncate sm:w-full">
                              <i className="fa-solid fa-location-dot"></i>
                              <span className="truncate ">Quảng bình, Huyện Quang Trị</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                        <Link
                          href={`/workshops`}
                          className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px]  text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                          <span className="">Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                    <div className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                      <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center  sm:gap-[33px]">
                        <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                          <ImageComponent src={schoolDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                        </div>

                        <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                          <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                            <h4 className="truncate text-[22px] font-semibold text-primary-black">
                              Workshop 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                            </h4>
                            <p className="truncate text-lg text-primary-gray">Mô tả wokshop</p>
                          </div>
                          <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                            <span className="flex items-center gap-1 ">
                              <i className="fa-solid fa-calendar"></i>
                              <span className="truncate">12, tháng 10, 2024</span>
                            </span>
                            <span className="flex items-center  gap-1 truncate sm:w-full">
                              <i className="fa-solid fa-location-dot"></i>
                              <span className="truncate ">Quảng bình, Huyện Quang Trị</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                        <Link
                          href={`/workshops`}
                          className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px]  text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                          <span className="">Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                    <div className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                      <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center  sm:gap-[33px]">
                        <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                          <ImageComponent src={schoolDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                        </div>

                        <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                          <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                            <h4 className="truncate text-[22px] font-semibold text-primary-black">
                              Workshop 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                            </h4>
                            <p className="truncate text-lg text-primary-gray">
                              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit fugit libero deserunt eveniet aspernatur, aliquid, debitis ab
                              reprehenderit aut doloribus ipsam. Nemo quos magni officiis quidem quod ipsa at voluptatem!
                            </p>
                          </div>
                          <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                            <span className="flex items-center gap-1 ">
                              <i className="fa-solid fa-calendar"></i>
                              <span className="truncate">12, tháng 10, 2024</span>
                            </span>
                            <span className="flex items-center  gap-1 truncate sm:w-full">
                              <i className="fa-solid fa-location-dot"></i>
                              <span className="truncate ">Quảng bình, Huyện Quang Trị</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                        <Link
                          href={`/workshops`}
                          className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px]  text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                          <span className="">Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                    <div className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                      <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center  sm:gap-[33px]">
                        <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                          <ImageComponent src={schoolDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                        </div>

                        <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                          <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                            <h4 className="truncate text-[22px] font-semibold text-primary-black">
                              Workshop 1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                            </h4>
                            <p className="truncate text-lg text-primary-gray">Mô tả wokshop</p>
                          </div>
                          <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                            <span className="flex items-center gap-1 ">
                              <i className="fa-solid fa-calendar"></i>
                              <span className="truncate">12, tháng 10, 2024</span>
                            </span>
                            <span className="flex items-center  gap-1 truncate sm:w-full">
                              <i className="fa-solid fa-location-dot"></i>
                              <span className="truncate ">Quảng bình, Huyện Quang Trị</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                        <Link
                          href={`/workshops`}
                          className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px]  text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                          <span className="">Xem chi tiết</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-[54px] lg:basis-5/12 xl:basis-4/12">
                <GoogleMap googleMapsUrl={googleMapsUrl} title="Vị trí trên Google Maps" width={600} height={300} />
                <LinkCard
                  logoUrl={schoolDetails.logoUrl}
                  name={schoolDetails.universityName}
                  shortDes={schoolDetails.universityShortDescription}
                  websiteUrl={schoolDetails.linkWebsite}
                />
              </div>
            </div>
          </div>
        </main>
      </PortalLayout>
    </>
  );
};

export default SchoolDetailsPage;
