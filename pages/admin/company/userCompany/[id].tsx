import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PaymentsIcon from '@mui/icons-material/Payments';
import TransgenderIcon from '@mui/icons-material/Transgender';
import CakeIcon from '@mui/icons-material/Cake';
import { useEffect } from 'react';
import ContactMailIcon from '@mui/icons-material/ContactMail';

import MailIcon from '@mui/icons-material/Mail';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetDetailEmployeeQuery } from '@/services/adminCompanyApi';
import { setLoading } from '@/store/slices/global';
import ImageComponent from '@/components/Common/Image';
import { genderTitle } from '@/utils/app/const';

const DetailUserCompany = () => {
  const idEmployee = useAppSelector(state => state.global.id);
  // console.log(idEmployee);

  const dispatch = useAppDispatch();
  const { data: employee, isLoading } = useGetDetailEmployeeQuery({ id: idEmployee });
  // console.log(employee);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className="rounded-2xl bg-white p-3 pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/company/userCompany'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin quản lý tài khoản nhân viên </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-4 sm:p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-5">
            <ImageComponent src={employee?.data?.avatarUrl} alt={employee?.data?.fullName} width={75} height={75} className="rounded-full" />
          </div>
          <div>
            <Link href={'#'}>
              <h2 className="text-lg font-bold lg:text-xl">{employee?.data.fullName}</h2>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tên đầy đủ:</span> {employee?.data.fullName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <MailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email :</span> {employee?.data.account.email}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Chức vụ:</span> {employee?.data.employeePosition}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {employee?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <TransgenderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Giới tính:</span> {genderTitle(employee?.data.gender)}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CakeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày sinh:</span> {employee?.data.dateOfBirth}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <PaymentsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Lương(VND):</span> {employee?.data.salary}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <ContactMailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {employee?.data.address.houseNumber},{employee?.data.address.ward.wardName},
              {employee?.data.address.district.districtName},{employee?.data.address.province.provinceName}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailUserCompany;
