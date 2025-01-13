import { Chip } from '@mui/material';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BackdropType, setBackdrop, setName } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import ImageComponent from '@/components/Common/Image';
import { formatJobType, formatSalaryVND } from '@/utils/app/format';
import { statusTextWorkshop } from '@/utils/app/const';
import { IJobDetailResponse } from '@/types/jobCompany';
interface DetailJobComponentProps {
  jobDetail: IJobDetailResponse;
  href: string;
  IsAdmin?: boolean;
}
const DetailJobComponent: React.FC<DetailJobComponentProps> = ({ jobDetail, href, IsAdmin = false }) => {
  const dispatch = useDispatch();

  return (
    <div className="rounded-2xl bg-[#f1f5f8] pb-[90px]">
      <section className="grid grid-cols-1 rounded-t-lg bg-[#081721] py-6 pl-4 lg:grid-cols-2">
        <div className="text-[#f8f9fa] sm:px-3 lg:px-0">
          <Link href={`${href}`}>
            <ArrowBackIcon fontSize="small" />
            Trở về
          </Link>
          <div className="my-12">
            <div className="flex flex-col">
              <div className="mb-2 flex gap-2">
                <Chip label={formatJobType(jobDetail?.data.jobType)} color="success" />
                <Chip label={formatJobType(jobDetail?.data.jobLevel)} color="secondary" />
              </div>
              <h2 className="mb-1 text-3xl font-semibold">{jobDetail?.data.jobTitle}</h2>
              <div>
                <span className="text-xs font-medium">
                  <i className="fa-solid fa-location-dot me-1 text-[9px] opacity-75"></i>
                  {jobDetail?.data.company.address.houseNumber}, {jobDetail?.data.company.address.ward.wardName},{' '}
                  {jobDetail?.data.company.address.district.districtName}, {jobDetail?.data.company.address.province.provinceName}
                </span>
              </div>
              <div className="py-4">
                <p className="mb-2 text-sm">
                  Ngày tạo: {jobDetail?.data.createAt.split(' ')[0]}, Ngày hết hạn: {jobDetail?.data.expirationDate.split(' ')[0]}
                </p>
                <p className="mb-2 text-sm">
                  Trạng thái:{' '}
                  <span style={{ color: statusTextWorkshop(jobDetail?.data.status).color }}>{statusTextWorkshop(jobDetail?.data.status).title}</span>
                </p>
              </div>
              {jobDetail?.data.status === 'PENDING' && IsAdmin && (
                <div className="flex gap-4">
                  <Button
                    text="Từ chối"
                    className="bg-red-500 text-black"
                    onClick={() => {
                      dispatch(setName(jobDetail?.data.jobTitle));
                      dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                    }}
                  />
                  <Button
                    text="Duyệt"
                    onClick={() => {
                      dispatch(setName(jobDetail?.data.jobTitle));
                      dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <div className="flex items-center">
              <i className="fa-solid fa-business-time fs-1 text-[#1ca774] sm:text-[25px] "></i>
              <div className="flex flex-col pl-2">
                <span className="text-sm opacity-75">Cấp bậc</span>
                <span className="font-bold">{jobDetail?.data.jobLevel}</span>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-location-dot fs-1 text-[#1ca774] sm:text-[25px]"></i>
              <div className="flex flex-col pl-2">
                <span className="text-sm opacity-75">Địa chỉ</span>
                <span className="font-bold">{jobDetail?.data.company.address.province.provinceName}</span>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-sack-dollar fs-1 text-[#1ca774] sm:text-[25px]"></i>
              <div className="flex flex-col pl-2">
                <span className="text-sm opacity-75">Lương</span>
                <span className="font-bold">
                  {jobDetail?.data.salaryType === 'FIXED'
                    ? `${formatSalaryVND(jobDetail?.data.minSalary)} - ${formatSalaryVND(jobDetail?.data.maxSalary)}`
                    : 'Thỏa thuận'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative bottom-0 right-0 top-0 z-[1] hidden lg:block">
          <img
            src="https://shreethemes.net/jobstock-landing-2.3/jobstock/assets/img/banner-1.jpg"
            alt=""
            className="h-full rounded-bl-[800px] rounded-tl-[800px]"
          />
        </div>
      </section>

      <section className="grid grid-cols-12 gap-4 px-4 py-10">
        <div className="col-span-12 md:col-span-8">
          <div className="flex flex-col gap-5 rounded-md bg-white p-6 font-semibold">
            <div>
              <h5 className="mb-2 text-xl text-[#05264e]">Mô tả công việc</h5>
              <p dangerouslySetInnerHTML={{ __html: jobDetail?.data.jobDescription ?? '' }} className="text-sm font-normal text-[#4f5e64]"></p>
            </div>
            <div>
              <h5 className="mb-2 text-xl text-[#05264e]">Yêu cầu</h5>
              <p dangerouslySetInnerHTML={{ __html: jobDetail?.data.requirements ?? '' }} className="text-sm font-normal text-[#4f5e64]"></p>
            </div>
            <div>
              <h5 className="mb-2 text-xl text-[#05264e]">Đãi ngộ</h5>
              <p dangerouslySetInnerHTML={{ __html: jobDetail?.data.benifits ?? '' }} className="text-sm font-normal text-[#4f5e64]"></p>
            </div>
            <div>
              <h5 className="mb-2 text-xl text-[#05264e]">Thời gian làm việc</h5>
              <p className="text-sm font-normal text-[#4f5e64]">{jobDetail?.data.workTime}</p>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className="flex flex-col gap-5 rounded-md bg-white p-6 font-semibold">
            <div className="mb-8 flex items-center gap-4">
              <ImageComponent
                src={jobDetail?.data.company.logoUrl}
                alt={jobDetail?.data.company.companyName}
                width={70}
                height={70}
                className="rounded-full object-contain"
              />
              <div>
                <h5 className="text-xl">{jobDetail?.data.company.companyName}</h5>
                <span className="text-xs font-medium text-[#002c3f99]">
                  <i className="fa-solid fa-location-dot me-1 text-[9px] opacity-75"></i>
                  {jobDetail?.data.company.address.houseNumber}, {jobDetail?.data.company.address.ward.wardName},{' '}
                  {jobDetail?.data.company.address.district.districtName}, {jobDetail?.data.company.address.province.provinceName}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2">
              <div>
                <span className="text-xs text-[#002c3f99]">Mã công ty:</span>
                <h6>{jobDetail?.data.company.companyCode}</h6>
              </div>
              <div>
                <span className="text-xs text-[#002c3f99]">Mã số thuế:</span>
                <h6>{jobDetail?.data.company.taxCode}</h6>
              </div>
              <div>
                <span className="text-xs text-[#002c3f99]">Số điện thoại:</span>
                <h6>{jobDetail?.data.company.phoneNumber}</h6>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#002c3f99]">Link website:</span>
                <Link href={jobDetail?.data.company.linkWebsite ?? ''} target="_blank" className="break-words">
                  {jobDetail?.data.company.linkWebsite}
                </Link>
              </div>
              <div>
                <span className="text-xs text-[#002c3f99]">Ngày thành lập:</span>
                <h6>20/12/2003</h6>
              </div>
              <div>
                <span className="text-xs text-[#002c3f99]">Quy mô:</span>
                <h6>1000 nhân viên</h6>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DetailJobComponent;
