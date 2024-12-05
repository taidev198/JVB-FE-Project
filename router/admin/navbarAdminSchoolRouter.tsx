import IconDepartment from '@/assets/icons/iconNavbarAdminSchool/icon-department.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';

import IconBusiness from '@/assets/icons/iconNavbarAdminSchool/icon-business.svg';
import IconSchool from '@/assets/icons/iconNavbarAdminSchool/icon-school.svg';
import IconStudent from '@/assets/icons/iconNavbarAdminSchool/icon-student.svg';
import IconAcademic from '@/assets/icons/iconNavbarAdminSchool/icon-academic.svg';

import IconChangePassword from '@/assets/icons/iconNavbar/password.svg';

export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/school',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconDepartment />,
    url: '/admin/school/department',
    label: 'Quản Lý Khoa',
  },
  {
    id: 3,
    icon: <IconBusiness />,
    url: '/admin/school/businessManagement',
    label: 'Quản Lý Ngành Học',
  },
  {
    id: 4,
    icon: <IconSchool />,
    url: '/admin/school/schoolManagement',
    label: 'Quản Lý Hồ Sơ Trường',
  },
  {
    id: 5,
    icon: <IconAcademic />,
    url: '/admin/school/academicOfficeManagement',
    label: 'Quản Lý Giáo Vụ',
  },
  {
    id: 6,
    icon: <IconStudent />,
    url: '/admin/school/studentsManagement',
    label: 'Quản Lý Sinh Viên',
  },

  {
    id: 7,
    icon: <IconChangePassword />,
    url: '/admin/school/changePassword',
    label: 'Đổi mật khẩu',
  },
];
