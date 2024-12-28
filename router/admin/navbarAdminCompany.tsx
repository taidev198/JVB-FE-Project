import IconDepartment from '@/assets/icons/iconNavbarAdminSchool/icon-department.svg';
// import IconJob from '@/assets/icons/iconNavbarAdminSchool/icon-job.svg';
import IconSchool from '@/assets/icons/iconNavbarAdminSchool/icon-school.svg';
import IconHand from '@/assets/icons/iconNavbarAdminSchool/icon-hand.svg';
import IconEmployee from '@/assets/icons/iconNavbarAdminCompany/icon-userCompany.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconWorkshop from '@/assets/icons/iconNavbar/workshop.svg';
import IconNotification from '@/assets/icons/notification.svg';
import IconChangePassword from '@/assets/icons/iconNavbar/password.svg';

export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/company/dashboard',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconSchool />,
    url: '/admin/company/profile',
    label: 'Quản lý hồ sơ công ty',
  },

  {
    id: 3,
    icon: <IconWorkshop />,
    url: '/admin/company/workShop',
    label: 'Quản lý workShop',
  },
  {
    id: 4,
    icon: <IconEmployee />,
    url: '/admin/company/userCompany',
    label: 'Quản lý nhân viên',
  },
  {
    id: 5,
    icon: <IconDepartment />,
    url: '/admin/company/jobCompany',
    label: 'Quản lý job',
  },
  {
    id: 8,
    icon: <IconHand />,
    url: '/admin/company/partnerships',
    label: 'Quản lý hợp tác',
  },
  {
    id: 6,
    icon: <IconNotification />,
    url: '/admin/company/notification',
    label: 'Thông báo',
  },
  {
    id: 7,
    icon: <IconChangePassword />,
    url: '/admin/company/changeCompany',
    label: 'Thay đổi mật khẩu',
  },
];
