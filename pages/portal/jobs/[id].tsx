// pages/portal/companies/[id].tsx
import { CalendarOutlined, ClockCircleOutlined, DollarOutlined, LaptopOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Select } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import BreadCrumbHeaderDetail from '@/components/portal/common/BreadCrumbHeaderDetail';
import HtmlContentRenderer from '@/components/portal/common/HtmlContentRenderer';
import LinkCard from '@/components/portal/common/LinkCard';
import GoogleMap from '@/components/portal/common/MapCard';
import PortalLoadingLarge from '@/components/portal/common/PortalLoadingLarge';
import PortalLayout from '@/layouts/portal/PortalLayout';
import { useGetJobDetailsQuery, useSendApplyJobMutation } from '@/services/portalHomeApi';
import { formatJobLevel, formatJobType, formatSalaryVND } from '@/utils/app/format';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { useGetAllMajorsQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

interface JobDetailsProps {
  serverSideApiKeyIsSet: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [majorId, setMajorId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const { id } = router.query;
  const { data, isLoading, error } = useGetJobDetailsQuery({ id: Number(id) });
  const { data: majors } = useGetAllMajorsQuery();
  const [apply, { isLoading: applyLoading }] = useSendApplyJobMutation();
  const handleConfirmAction = async () => {
    try {
      await apply({ major: majorId, job: data.data.id }).unwrap();
      toast.success('Apply công việc thành công');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    } finally {
      dispatch(setBackdrop(null));
    }
  };

  useEffect(() => {
    dispatch(setLoading(applyLoading));
  }, [dispatch, applyLoading]);
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
            onButtonClick={() => dispatch(setBackdrop(BackdropType.AddModal))}
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
          {showBackdrop === BackdropType.AddModal && (
            <BackDrop isCenter>
              <div className="max-w-[400px] rounded-md p-6">
                <h3 className="font-bold">{showBackdrop === BackdropType.AddModal && `Chọn ngành để ứng tuyển`}</h3>
                <p className="mb-3 mt-1">Bạn cần chọn ngành học để ứng tuyển vào công việc này</p>
                <div className="flex items-center justify-center">
                  <Select
                    showSearch
                    placeholder="Chọn nghành học"
                    optionFilterProp="label"
                    onChange={value => {
                      setMajorId(value);
                    }}
                    options={majors?.data?.map(major => ({
                      label: major.majorName,
                      value: major.id,
                    }))}
                    size={'large'}
                    allowClear={true}
                    className="w-[250px]"
                  />
                </div>
                <div className="mt-9 flex items-center gap-5">
                  <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
                  <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
                </div>
              </div>
            </BackDrop>
          )}
        </main>
      </PortalLayout>
    </>
  );
};

export default JobDetails;
