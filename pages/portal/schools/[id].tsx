// pages/portal/companies/[id].tsx

import { BookOutlined, CalendarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Select } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import ImageComponent from '@/components/Common/Image';
import BreadCrumbHeaderDetail from '@/components/portal/common/BreadCrumbHeaderDetail';
import CustomPagination from '@/components/portal/common/CustomPagination';
import LinkCard from '@/components/portal/common/LinkCard';
import GoogleMap from '@/components/portal/common/MapCard';
import PortalEmpty from '@/components/portal/common/PortalEmpty';
import PortalLoading from '@/components/portal/common/PortalLoading';
import { useGetSchoolDetailsQuery, useGetWorkshopsUniversityQuery, useSendConnectMutation } from '@/services/portalHomeApi';
import { IWorkshopPortal } from '@/types/workshop';
import PortalLoadingLarge from '@/components/portal/common/PortalLoadingLarge';
import PortalLayout from '@/layouts/portal/PortalLayout';
import { useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface SchoolDetailsPageProps {
  serverSideApiKeyIsSet: boolean;
}

const SchoolDetailsPage: React.FC<SchoolDetailsPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const idLogin = useAppSelector(state => state.user.id);

  const { Option } = Select;

  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedWorkshops, setPaginatedWorkshops] = useState<IWorkshopPortal[]>([]);
  const [pageSize, setPageSize] = useState(4);

  const { data, isLoading, error } = useGetSchoolDetailsQuery({ id: Number(id) });
  const { data: workshopsData, isLoading: isLoadingWorkshops } = useGetWorkshopsUniversityQuery(
    { universityId: Number(id), page: 1, size: 1000 },
    { refetchOnMountOrArgChange: true }
  );
  const [sendRequests, { isLoading: sendRequestsLoading }] = useSendConnectMutation();

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const triggerPageChange = (page: number) => {
    setFadeState('fade-out');
    setTimeout(() => {
      handlePageChange(page);
      setFadeState('fade-in');
    }, 300); // Matches fade-out duration
  };

  useEffect(() => {
    dispatch(setLoading(sendRequestsLoading));
    if (workshopsData?.data.content) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPaginatedWorkshops(workshopsData.data.content.slice(startIndex, endIndex));
    } else {
      setPaginatedWorkshops([]); // Clear paginated data if workshopsData is empty
    }
  }, [workshopsData, currentPage, pageSize, dispatch, sendRequestsLoading]);

  if (isLoading) {
    return (
      <PortalLayout type="school-detail">
        <PortalLoadingLarge />
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout type="school-detail">
        <Alert message="Error" description="Failed to load school details" type="error" showIcon />
      </PortalLayout>
    );
  }

  const universityDetails = data?.data;
  const workshops: IWorkshopPortal[] = isLoadingWorkshops ? [] : workshopsData?.data.content || [];

  const address = `${universityDetails?.address?.houseNumber}, ${universityDetails?.address?.ward.wardName}, ${universityDetails?.address?.district.districtName}, ${universityDetails?.address?.province.provinceName}`;
  const zoomLevel = 20;
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=${zoomLevel}&output=embed`;
  const handleSendRequests = async () => {
    try {
      await sendRequests({ accountLoginId: idLogin, toDoAccountId: data.data.id, doBy: 1 }).unwrap();
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
  return (
    <>
      <Head>
        <title>JobLink - {universityDetails?.universityName}</title>
        <meta name="description" content={universityDetails?.universityShortDescription || 'Company details page'} />
        <meta name="viewport" content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
      </Head>

      <PortalLayout type="school-detail">
        <main>
          <BreadCrumbHeaderDetail
            title={universityDetails?.universityName || 'Trường học'}
            schoolType={universityDetails?.universityShortDescription || 'Chi tiết trường học'}
            address={`${universityDetails?.address?.houseNumber},${universityDetails?.address?.ward.wardName}, ${universityDetails?.address?.district.districtName}, ${universityDetails?.address?.province.provinceName}`}
            logo={universityDetails?.logoUrl}
            currentPage="Trường học"
            onButtonClick={handleSendRequests}
            buttonText="Liên kết ngay"
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
                        <span className="block text-primary-gray">{universityDetails?.establishedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <TeamOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số lượng sinh viên</span>
                        <span className="block text-primary-gray">{universityDetails?.numberOfStudents}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <PhoneOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Số điện thoại</span>
                        <span className="block text-primary-gray">{universityDetails?.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <EnvironmentOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Địa chỉ</span>
                        <span className="block text-primary-gray">{universityDetails?.address.province.provinceName}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <BookOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Mã trường học</span>
                        <span className="block text-primary-gray">{universityDetails?.universityCode}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-[15px]">
                      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-primary-white">
                        <MailOutlined className="text-lg text-primary-main" />
                      </div>
                      <div className="flex flex-col">
                        <span className="block text-lg font-medium text-primary-black">Email</span>
                        <span className="block text-primary-gray">{universityDetails.account?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about ">
                  <h3 className="mb-[20px] text-[24px] font-semibold text-primary-black">Giới thiệu trường học</h3>
                  <p className="text-lg text-primary-gray">{universityDetails?.universityDescription}</p>
                </div>
                <div className="workshop">
                  <div className="mb-[20px] flex items-center justify-between">
                    <h3 className="text-[24px] font-semibold text-primary-black">Danh sách workshop</h3>

                    {workshops?.length > 0 && (
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
                  {isLoadingWorkshops ? (
                    <PortalLoading />
                  ) : workshops?.length > 0 ? (
                    <>
                      <div className={`grid grid-cols-1 gap-[20px] transition-opacity duration-500 ${fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}>
                        {paginatedWorkshops?.map(workshop => (
                          <div key={workshop.id} className="relative rounded-[10px] border border-primary-border px-[24px] py-[34px]">
                            <div className="overflow-hidden sm:flex sm:w-[calc(100%-150px)] sm:items-center sm:gap-[33px]">
                              <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-md bg-primary-light">
                                <ImageComponent src={universityDetails?.logoUrl} alt="logo" width={60} height={60} className="object-contain" />
                              </div>
                              <div className="flex min-h-full flex-col justify-between sm:w-[calc(100%-150px)]">
                                <div className="mt-3 flex w-full flex-col gap-2 sm:mt-0">
                                  <h4 className="truncate text-[22px] font-semibold text-primary-black">{workshop.workshopTitle}</h4>
                                  <p className="truncate text-lg text-primary-gray" dangerouslySetInnerHTML={{ __html: workshop.workshopDescription }}></p>
                                </div>
                                <div className="mt-2 flex flex-col items-start gap-2 text-lg text-primary-gray lg:max-w-[60%] lg:flex-col lg:items-start lg:gap-2 xl:max-w-full xl:flex-row xl:items-center xl:gap-4">
                                  <span className="flex items-center gap-1 ">
                                    <i className="fa-solid fa-calendar"></i>
                                    <span className="truncate">{workshop.startTime}</span>
                                  </span>
                                  <span className="flex items-center gap-1 truncate sm:w-full">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <span className="truncate ">
                                      {universityDetails?.address.province.provinceName}, {universityDetails?.address.district.districtName}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute hidden items-center justify-end sm:bottom-[30px] sm:right-[24px] sm:flex ">
                              <Link
                                href={`/portal/workshops/${workshop.id}`}
                                className="mp_transition_4 readmore__btn mf-2 flex items-center gap-2 rounded-md bg-primary-main px-[20px] py-[10px] text-lg text-primary-white hover:bg-primary-black sm:mr-2">
                                <span className="">Xem chi tiết</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-[70px] w-full">
                        <CustomPagination
                          total={workshops?.length || 0}
                          currentPage={currentPage}
                          pageSize={pageSize}
                          onChange={page => triggerPageChange(page)}
                        />
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
                  logoUrl={universityDetails.logoUrl}
                  name={universityDetails.universityName}
                  shortDes={universityDetails.universityShortDescription}
                  websiteUrl={universityDetails.linkWebsite}
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
