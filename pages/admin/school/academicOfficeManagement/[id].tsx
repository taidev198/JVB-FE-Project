import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TransgenderIcon from '@mui/icons-material/Transgender';
import MailIcon from '@mui/icons-material/Mail';
import Image from 'next/image';
import CakeIcon from '@mui/icons-material/Cake';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { setLoading } from '@/store/slices/global';
import { useGetDetailAcademicOfficeManagementQuery } from '@/services/adminSchoolApi';
const DetailAdemicOfficeManagement = () => {
  const idAdemicOfficeManagement = useAppSelector(state => state.global.id);
  const dispatch = useAppDispatch();
  const { data: academicOfficeManagement, isLoading } = useGetDetailAcademicOfficeManagementQuery({ id: idAdemicOfficeManagement });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/school/academicOfficeManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin quản lý giáo vụ </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin giáo vụ</p>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-6">
            <Image src={academicOfficeManagement?.data.avatarUrl ?? ''} alt="name" width={75} height={75} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{academicOfficeManagement?.data.fullName}</h2>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <StarBorderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã sinh viên:</span> {academicOfficeManagement?.data.employeeCode}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span>
              {academicOfficeManagement?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <TransgenderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Giới tính :</span> {academicOfficeManagement?.data.gender}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <CakeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày sinh:</span> {academicOfficeManagement?.data.dateOfBirth}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <MailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span>
              {academicOfficeManagement?.data.account?.email}
            </div>
          </li>
          <li className="mt-4 flex items-center gap-3">
            <ContactMailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {academicOfficeManagement?.data.address.houseNumber},
              {academicOfficeManagement?.data.address.ward.wardName},{academicOfficeManagement?.data.address.district.districtName},
              {academicOfficeManagement?.data.address.province.provinceName}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailAdemicOfficeManagement;
