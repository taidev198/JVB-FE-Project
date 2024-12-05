
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

import Link from 'next/link';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import StarBorderIcon from '@mui/icons-material/StarBorder';
// import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import CreditScoreIcon from '@mui/icons-material/CreditScore';

const DetailUserCompany = () => {
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
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
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết nhân viên</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <StarBorderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã ngành:</span> #2046
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tên đầy đủ:</span> MattDickerson
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <CreditScoreIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email :</span> Dickerson@gmail.com
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Chức vụ:</span> Quản lý
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <PhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> 01234567
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <PersonOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Giới tính:</span> Nam
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <DateRangeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày sinh:</span> 01/01/1990
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <PaymentsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Lương(VND):</span> 50000000
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <AddLocationAltIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> 123 Đường ABC, QUận XYZ, TP. Hồ Chí Minh
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailUserCompany;
;
