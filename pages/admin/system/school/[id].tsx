import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrafficIcon from '@mui/icons-material/Traffic';

import { useAppSelector } from '@/store/hooks';
import { useGetDetailAccountSchoolQuery } from '@/services/adminSystemApi';
import { typeAccount, typeUniversityTitle } from '@/utils/app/const';
import { setLoading } from '@/store/slices/global';

const AdminSystemDetailSchool = () => {
  const dispatch = useDispatch();
  const id = useAppSelector(state => state.global.id);
  const { data, isLoading } = useGetDetailAccountSchoolQuery({ id });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/school'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin tài khoản trường đại học </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-6">
            <Image src={data?.data.logoUrl ?? ''} alt="name" width={75} height={75} className="rounded-full" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{data?.data.universityName}</h2>
            <Link href={'#'}>
              <p className="text-primary-gray hover:text-primary-main">Xem chi tiết</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {data?.data.email}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {data?.data.address.houseNumber}, {data?.data.address.ward.wardName},
              {data?.data.address.district.districtName}, {data?.data.address.province.provinceName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <SchoolIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Loại trường:</span> {typeUniversityTitle(data?.data.universityType ?? '').title}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {data?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div>
              <div className="flex items-center gap-3">
                <TrafficIcon sx={{ color: '#757575' }} />
                <span className="mr-2 font-semibold">Trạng thái:</span>
                <Chip
                  label={typeAccount(data?.data.account?.statusAccount ?? '').title}
                  style={{
                    backgroundColor: typeAccount(data?.data.account?.statusAccount ?? '').bg,
                    color: typeAccount(data?.data.account?.statusAccount ?? '').color,
                  }}
                />
              </div>
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <GroupsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng sinh viên:</span> {data?.data.numberOfStudents}
            </div>
          </li>{' '}
          <li className="mt-4 flex items-center  gap-3 ">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng sinh viên đã tốt nghiệp:</span> {data?.data.numberOfGraduates}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <LightbulbIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mô tả:</span> {data?.data.universityDescription}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminSystemDetailSchool;
