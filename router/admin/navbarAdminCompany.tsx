import WorkIcon from '@mui/icons-material/Work';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconProfile from '@/assets/icons/iconNavbarAdminCompany/icon-profileCompany.svg';
import IconWorkShop from '@/assets/icons/iconNavbarAdminCompany/icon-workShopCompany.svg';
import IconEmployee from '@/assets/icons/iconNavbarAdminCompany/icon-userCompany.svg';
import IconNotice from '@/assets/icons/iconNavbarAdminCompany/icon-noticeCompany.svg';
import IconChangePass from '@/assets/icons/iconNavbarAdminCompany/icon-changeCompany.svg';
export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/company/dashboard',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconProfile />,
    url: '/admin/company/profileCompany',
    label: 'Hồ Sơ Công Ty',
  },
  // {
  //   id: 3,
  //   icon: <IconRecruitment />,
  //   url: '/admin/company/recruitmentCompany',
  //   label: 'Quản Lý Tin Tuyển Dụng',
  // },
  {
    id: 3,
    icon: <IconWorkShop />,
    url: '/admin/company/workShopCompany',
    label: 'Quản Lý Workshop',
  },
  {
    id: 4,
    icon: <IconEmployee />,
    url: '/admin/company/userCompany',
    label: 'Quản Lý Nhân Viên',
  },
  {
    id: 5,
    icon: <WorkIcon />,
    url: '/admin/company/jobCompany',
    label: 'Quản Lý Job',
  },
  {
    id: 6,
    icon: <WorkIcon />,
    url: '/admin/company/requestListCompany',
    label: 'Danh sách yêu cầu',
  },
  {
    id: 7,
    icon: <IconNotice />,
    url: '/admin/company/noticeCompany',
    label: 'Thông Báo',
  },
  {
    id: 8,
    icon: <IconChangePass />,
    url: '/admin/company/changeCompany',
    label: 'Thay đổi mật khẩu',
  },
];
