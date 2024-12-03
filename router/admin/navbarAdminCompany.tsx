import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconProfile from '@/assets/icons/iconNavbarAdminCompany/icon-profileCompany.svg';

import IconRecruitment from '@/assets/icons/iconNavbarAdminCompany/icon-recruitmentCompany.svg';
import IconWorkShop from '@/assets/icons/iconNavbarAdminCompany/icon-workShopCompany.svg';
import IconEmployee from '@/assets/icons/iconNavbarAdminCompany/icon-userCompany.svg';
import IconNotice from '@/assets/icons/iconNavbarAdminCompany/icon-noticeCompany.svg';
import IconChangePass from '@/assets/icons/iconNavbarAdminCompany/icon-changeCompany.svg';
export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/company',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconProfile />,
    url: '/admin/company/profileCompany',
    label: 'Hồ Sơ Công Ty',
  },
  {
    id: 3,
    icon: <IconRecruitment />,
    url: '/admin/company/recruitmentCompany',
    label: 'Quản Lý Tin Tuyển Dụng',
  },
  {
    id: 4,
    icon: <IconWorkShop />,
    url: '/admin/company/workShopCompany',
    label: 'Quản Lý Workshop',
  },
  {
    id: 5,
    icon: <IconEmployee />,
    url: '/admin/company/userCompany',
    label: 'Quản Lý Nhân Viên',
  },
  {
    id: 6,
    icon: <IconNotice/>,
    url: '/admin/company/noticeCompany',
    label: 'Thông Báo',
  },
  {
    id: 7,
    icon: <IconChangePass />,
    url: '/admin/company/changeCompany',
    label: 'Thay đổi mật khẩu',
  },
];
