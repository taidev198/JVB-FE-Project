import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WcIcon from '@mui/icons-material/Wc';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import CategoryIcon from '@mui/icons-material/Category';
import avatar from '@/assets/images/avata.png';
const DetailStudentsManagement = () => {
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/school/studentsManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin tài khoản Nhân viên</h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-6">
            <Image src={avatar} alt="name" width={75} height={75} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nguyễn Văn A</h2>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin sinh viên</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <DeviceHubIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã Sinh Viên:</span> Ph44799
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> contact@gmail.com
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DeviceHubIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> (+85) 123 456 789
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> 66 Tố Hữu, Nam Từ Liêm, Hà Nội
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Điểm trung bình:</span> 3.2
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <WcIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Giới tính:</span> Nam
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Năm nhập học</span> 2021
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CategoryIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Trạng thái</span>GRADUATED
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngành:</span> Công Nghệ Thông Tin
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Khoa:</span> Công Nghệ
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailStudentsManagement;
