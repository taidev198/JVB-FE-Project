import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useGetSchoolDetailsQuery } from '@/services/portalHomeApi';
import PortalLayout from '@/layouts/Portal/PortalLayout';
import BreadCrumbHeaderDetail from '@/components/Portal/common/BreadCrumbHeaderDetail';
import SchoolDetail from '@/components/Portal/SchoolDetail/SchoolDetail';
import { Spin, Alert } from 'antd';
import { BookOutlined, CalendarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { convertSchoolType } from '@/utils/app/format';

interface SchoolsListProps {
  serverSideApiKeyIsSet: boolean;
}

const SchoolsListPage: React.FC<SchoolsListProps> = () => {
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

  const address = `${schoolDetails.address.houseNumber}, ${schoolDetails.address.ward.wardName}, ${schoolDetails.address.district.districtName}, ${schoolDetails.address.province.provinceName}`;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Use your Google Maps API key
  const googleMapsImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
    address
  )}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(address)}&key=${googleMapsApiKey}`;

  return (
    <>
      <Head>
        <title>{schoolDetails?.universityName || 'School Details'}</title>
        <meta name="description" content={schoolDetails?.universityShortDescription || 'School details page'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="company-list">
        <main>
          <BreadCrumbHeaderDetail
            title={schoolDetails?.universityName || 'School Details'}
            schoolType={convertSchoolType(schoolDetails?.schoolType)}
            address={`${schoolDetails?.address?.houseNumber},${schoolDetails?.address?.ward.wardName}, ${schoolDetails?.address?.district.districtName}, ${schoolDetails?.address?.province.provinceName}`}
            currentPage="Trường học"
          />
          <div className="mp_section_padding">
            <div className="container mx-auto flex items-start gap-[30px]">
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
                        <span className="block text-lg font-medium text-primary-black">Mã trường</span>
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
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Giới thiệu trường</h3>
                  <p className="text-lg text-primary-gray">
                    Đại học Bách Khoa Hà Nội (HUST) là một trong những trường đại học hàng đầu tại Việt Nam, chuyên đào tạo các ngành kỹ thuật và công nghệ.
                    Trường được biết đến với môi trường học tập sáng tạo, chương trình đào tạo chất lượng cao và cơ sở vật chất hiện đại. Với hơn 60 năm hình
                    thành và phát triển, HUST đã đào tạo hàng chục nghìn kỹ sư, chuyên gia chất lượng cao phục vụ cho nền kinh tế quốc gia và khu vực.
                  </p>
                </div>
                <div className="workshop">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Workshop của trường</h3>
                </div>
              </div>
              <div className="flex flex-col lg:basis-5/12 xl:basis-4/12">
                <h3>Google Maps</h3>
                <img src={googleMapsImageUrl} alt="School location on Google Maps" className="rounded-lg" />
              </div>
            </div>
          </div>
        </main>
      </PortalLayout>
    </>
  );
};

export default SchoolsListPage;
