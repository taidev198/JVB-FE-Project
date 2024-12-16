import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WcIcon from '@mui/icons-material/Wc';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import CategoryIcon from '@mui/icons-material/Category';
import { useAppSelector } from '@/store/hooks';
import { useGetDetailStudentQuery } from '@/services/adminSchoolApi';
import { genderTitle, StatusStudent } from '@/utils/app/const';
const DetailStudentsManagement = () => {
  const id = useAppSelector(state => state.global.id);
  const { data: detailStudent } = useGetDetailStudentQuery({ id });

  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/school/students'}>
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
            <Image src={detailStudent?.data?.avatarUrl ?? ''} alt="name" width={75} height={75} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{detailStudent?.data.fullName}</h2>
            <Link href={'#'}>
              <p className="text-primary-gray hover:text-primary-main">Chi tiết thông tin sinh viên</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <DeviceHubIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã Sinh Viên:</span> {detailStudent?.data.studentCode}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {detailStudent?.data.email}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Điểm trung bình:</span> {detailStudent?.data.gpa}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <WcIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Giới tính:</span> {genderTitle(detailStudent?.data.gender)}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Năm nhập học</span> {detailStudent?.data.yearOfEnrollment}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CategoryIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Trạng thái</span> {StatusStudent(detailStudent?.data.studentStatus)}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngành:</span> {detailStudent?.data.major.majorName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Khoa:</span> {detailStudent?.data.major.faculty.facultyName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <PhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {detailStudent?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {detailStudent?.data.address.houseNumber}, {detailStudent?.data.address.ward.wardName},{' '}
              {detailStudent?.data.address.district.districtName}, {detailStudent?.data.address.province.provinceName}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailStudentsManagement;
