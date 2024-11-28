import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';

import avatar from '@/assets/images/avata.png';

const AdminSystemDetailSchool = () => {
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
            <Image src={avatar} alt="name" width={75} height={75} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Đại học ABC</h2>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin đại học</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> contact@gmail.com
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> 66 Tố Hữu, Nam Từ Liêm, Hà Nội
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <SchoolIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Loại trường:</span> Đại học
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> (+85) 123 456 789{' '}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <GroupsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng sinh viên:</span> 5000
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminSystemDetailSchool;
