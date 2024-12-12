import WorkIcon from '@mui/icons-material/Work';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconEmployee from '@/assets/icons/iconNavbarAdminCompany/icon-userCompany.svg';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/company/dashboard',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <SaveAsIcon />,
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
    icon: <HomeIcon />,
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
    icon: <NotificationsIcon/>,
    url: '/admin/company/noticeCompany',
    label: 'Thông Báo',
  },
  {
    id: 8,
    icon: <LockOpenIcon />,
    url: '/admin/company/changeCompany',
    label: 'Thay đổi mật khẩu',
  },
];
