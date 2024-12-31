import { Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import React, { useEffect } from 'react';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CategoryIcon from '@mui/icons-material/Category';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MoneyIcon from '@mui/icons-material/Money';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { useGetDetailCompanyJobQuery } from '@/services/adminCompanyApi';
import { formatCurrencyVND } from '@/utils/app/format';
import { jobLever, jobType, statusLabelJob } from '@/utils/app/const';

const DetailJobCompany = () => {
  const idJobCompany = useAppSelector(state => state.global.id);

  const dispatch = useAppDispatch();
  const { data: jobCompany, isLoading } = useGetDetailCompanyJobQuery({ id: idJobCompany });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/company/jobCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Chi tiết công việc</h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <StarBorderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tiêu đề:</span> {jobCompany?.data.jobTitle}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div className="mb-auto">
              <CreditScoreIcon sx={{ color: '#757575' }} />
            </div>
            <div>
              <span className="mr-2 font-semibold">Hình thức:</span> {jobType(jobCompany?.data.jobType)}
            </div>
          </li>
          <li className="mt-5 flex items-center  gap-3 ">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Thời gian làm việc:</span> {jobCompany?.data.workTime}
            </div>
          </li>
          <li className="mt-5 flex items-center  gap-3 ">
            <TextFieldsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Cấp bậc:</span> {jobLever(jobCompany?.data.jobLevel)}
            </div>
          </li>
          <li className="mt-5 flex items-center  gap-3 ">
            <FaceRetouchingNaturalIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng cần tuyển:</span> {jobCompany?.data.memberOfCandidate}
            </div>
          </li>
          <li className="mt-5 flex items-center  gap-3 ">
            <DateRangeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày hết hạn:</span> {jobCompany?.data.expirationDate}
            </div>
          </li>
          <li className="mt-5 flex items-center  gap-3 ">
            <MoneyIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Lương:</span> {formatCurrencyVND(jobCompany?.data.maxSalary)} -{' '}
              {formatCurrencyVND(jobCompany?.data.minSalary)}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3 ">
            <div className="mb-auto">
              <CameraOutdoorIcon sx={{ color: '#757575' }} />
            </div>
            <div className="flex">
              <span className="mr-2 font-semibold">Phúc lợi:</span> <p dangerouslySetInnerHTML={{ __html: jobCompany?.data.benifits ?? '' }}></p>
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div className="mb-auto">
              <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            </div>
            <div className="flex">
              <span className="mr-2 font-semibold">Yêu cầu:</span> <p dangerouslySetInnerHTML={{ __html: jobCompany?.data.requirements ?? '' }}></p>
            </div>
          </li>
          <li className="mt-5">
            <div className="mb-auto flex items-center gap-3">
              <DescriptionIcon sx={{ color: '#757575' }} />
              <span className="mr-2 min-w-fit font-semibold">Mô tả:</span>
            </div>
            <p dangerouslySetInnerHTML={{ __html: jobCompany?.data.jobDescription ?? '' }} className="mt-3"></p>
          </li>

          <li className="mt-5 flex items-center  gap-3 ">
            <CategoryIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Trạng Thái:</span>{' '}
              <Chip
                label={statusLabelJob(jobCompany?.data.status).title}
                sx={{
                  backgroundColor: statusLabelJob(jobCompany?.data.status).bg,
                  color: statusLabelJob(jobCompany?.data.status).color,
                }}
              />
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3 ">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span className="mr-2 font-semibold">Loại công việc:</span>
                {jobCompany?.data.fields.map(field => (
                  <Chip key={field.id} label={field.fieldName} color="primary" variant="outlined" style={{ fontSize: '14px' }} />
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailJobCompany;
