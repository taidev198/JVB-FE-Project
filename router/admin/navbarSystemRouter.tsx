import IconSchool from '@/assets/icons/iconNavbar/school.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconGroup from '@/assets/icons/iconNavbar/group.svg';
import IconWorkshop from '@/assets/icons/iconNavbar/workshop.svg';
import IconChangePassword from '@/assets/icons/iconNavbar/password.svg';

export const litsNavbarSystemAdmin = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/system/dashboard',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconGroup />,
    url: '/admin/system/company',
    label: 'Quản lý Doanh Nghiệp',
  },
  {
    id: 3,
    icon: <IconSchool />,
    url: '/admin/system/school',
    label: 'Quản lý Trường Học',
  },
  {
    id: 4,
    icon: <IconWorkshop />,
    url: '/admin/system/workshop',
    label: 'Quản lý WorkShop',
  },
  {
    id: 5,
    icon: <IconChangePassword />,
    url: '/admin/system/change-password',
    label: 'Đổi mật khẩu',
  },
];
