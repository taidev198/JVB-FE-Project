import IconSchool from '@/assets/icons/iconNavbar/school.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconGroup from '@/assets/icons/iconNavbar/group.svg';
import IconWorkshop from '@/assets/icons/iconNavbar/workshop.svg';
import IconChangePassword from '@/assets/icons/iconNavbar/password.svg';
import IconJob from '@/assets/icons/iconNavbar/job.svg';
import IconNotification from '@/assets/icons/notification.svg';

export const litsNavbarIELTSSystemAdmin = [
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
    label: 'Quản lý doanh nghiệp',
  },
  {
    id: 3,
    icon: <IconSchool />,
    url: '/admin/system/school',
    label: 'Quản lý trường học',
  },
  {
    id: 4,
    icon: <IconWorkshop />,
    url: '/admin/system/workshop',
    label: 'Quản lý workshop',
  },
  {
    id: 5,
    icon: <IconJob />,
    url: '/admin/system/job',
    label: 'Quản lý jobs',
  },
  {
    id: 66,
    icon: <IconNotification />,
    url: '/admin/system/notification',
    label: 'Thông báo',
  },
  {
    id: 77,
    icon: <IconChangePassword />,
    url: '/admin/system/change-password',
    label: 'Đổi mật khẩu',
  },
];
