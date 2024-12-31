// pages/portal/companies/[id].tsx
import { CalendarOutlined, EnvironmentOutlined, StockOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import toast from 'react-hot-toast';

import BreadCrumbHeaderDetail from '@/components/Portal/common/BreadCrumbHeaderDetail';
import HtmlContentRenderer from '@/components/Portal/common/HtmlContentRenderer';
import LinkCard from '@/components/Portal/common/LinkCard';
import GoogleMap from '@/components/Portal/common/MapCard';
import PortalLoadingLarge from '@/components/Portal/common/PortalLoadingLarge';
import PortalLayout from '@/layouts/portal/PortalLayout';
import { useCompanyApplyWorkshopMutation, useGetWorkshopDetailsQuery } from '@/services/portalHomeApi';
import { formatWorkshopStatus } from '@/utils/app/format';

interface WorkshopDetailsProps {
  serverSideApiKeyIsSet: boolean;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useGetWorkshopDetailsQuery({ id: Number(id) });
  const [applyWorkshop, { isLoading: applyLoading }] = useCompanyApplyWorkshopMutation();

  if (isLoading) {
    return (
      <PortalLayout type="workshop-detail">
        <PortalLoadingLarge />
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout type="workshop-detail">
        <Alert message="Error" description="Failed to load workshop details" type="error" showIcon />
      </PortalLayout>
    );
  }

  const workshopDetails = data?.data;
  const address = `${workshopDetails?.address?.houseNumber}, ${workshopDetails?.address?.ward.wardName}, ${workshopDetails?.address?.district.districtName}, ${workshopDetails?.address?.province.provinceName}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=20&output=embed`;
  const handleApply = async () => {
    try {
      await applyWorkshop(data.data.id).unwrap();
      toast.success('Đăng ký tham gia thành công');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      <Head>
        <title>JobLink - {workshopDetails?.workshopTitle}</title>
        <meta name="description" content={workshopDetails?.university?.universityName || 'Trang chi tiết workshop'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="workshop-detail">
        <main>
          <BreadCrumbHeaderDetail
            title={workshopDetails?.workshopTitle || 'Tên workshop'}
            schoolType={workshopDetails?.university?.universityName}
            address={`${workshopDetails?.address?.houseNumber},${workshopDetails?.address?.ward.wardName}, ${workshopDetails?.address?.district.districtName}, ${workshopDetails?.address?.province.provinceName}`}
            logo={workshopDetails?.university?.logoUrl}
            currentPage="Chi tiết workshop'}"
            buttonText={`${data.data.isApply ? 'Đã tham gia' : 'Tham gia ngay'}`}
            onButtonClick={handleApply}
          />
          <div className="mp_section_padding">
            <div className="container mx-auto flex flex-col items-start gap-[30px] lg:flex-row">
              <div className="flex flex-col gap-[30px] lg:basis-7/12 xl:basis-8/12">
                <div className="overview rounded-[10px] bg-custom-gradient-1 p-[30px]">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Tổng quan về workshop</h3>
                  <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <CalendarOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Thời gian bắt đầu</span>
                        <span className="block text-primary-gray">{workshopDetails?.startTime}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <CalendarOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Thời gian kết thúc</span>
                        <span className="block text-primary-gray">{workshopDetails?.endTime}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <TeamOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số công ty ước tính</span>
                        <span className="block text-primary-gray">{workshopDetails?.estimateCompanyParticipants}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <StockOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Trạng thái</span>
                        <span className="block text-primary-gray">
                          {workshopDetails?.isDelete ? 'Đã hủy' : formatWorkshopStatus(workshopDetails?.workshopStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about ">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Mô tả workshop</h3>
                  <div className="text-lg text-primary-gray">
                    <HtmlContentRenderer htmlContent={workshopDetails?.workshopDescription || ''} />
                  </div>
                </div>
                <div className="benifits">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Lịch trình</h3>
                  <div className="text-lg text-primary-gray">
                    <HtmlContentRenderer htmlContent={workshopDetails?.agenda || ''} />
                  </div>
                </div>
                {/* <div className="image-swiper-container mt-[20px]">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Hình ảnh Workshop</h3>

                </div> */}
              </div>
              <div className="flex w-full flex-col gap-[54px] lg:basis-5/12 xl:basis-4/12">
                <GoogleMap googleMapsUrl={googleMapsUrl} title="Vị trí trên Google Maps" height={300} />
                <LinkCard
                  logoUrl={workshopDetails?.university?.logoUrl}
                  name={workshopDetails?.university?.universityName}
                  shortDes={workshopDetails?.university?.universityShortDescription}
                  websiteUrl={workshopDetails?.university?.linkWebsite}
                />
              </div>
            </div>
          </div>
        </main>
      </PortalLayout>
    </>
  );
};

export default WorkshopDetails;
