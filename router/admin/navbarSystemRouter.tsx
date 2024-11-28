import IconSchool from '@/assets/icons/iconNavbar/school.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconUser from '@/assets/icons/iconNavbar/user.svg';
import IconGroup from '@/assets/icons/iconNavbar/group.svg';

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
    label: 'Doanh Nghiệp',
  },
  {
    id: 3,
    icon: <IconSchool />,
    url: '/admin/system/school',
    label: 'Trường Học',
  },
  {
    id: 4,
    icon: <IconUser />,
    url: '/admin/system/sub-admin',
    label: 'Quản Trị Viên',
  },
];
