import IconDepartment from '@/assets/icons/iconNavbarAdminSchool/icon-department.svg';
import IconDashboard from '@/assets/icons/iconNavbar/dashboard.svg';
import IconBusiness from '@/assets/icons/iconNavbarAdminSchool/icon-business.svg';
import IconSchool from '@/assets/icons/iconNavbarAdminSchool/icon-school.svg';
import IconStudent from '@/assets/icons/iconNavbarAdminSchool/icon-student.svg';
import IconAcademic from '@/assets/icons/iconNavbarAdminSchool/icon-academic.svg';
import IconChangePassword from '@/assets/icons/iconNavbar/password.svg';
import IconNotification from '@/assets/icons/notification.svg';
import IconWorkshop from '@/assets/icons/iconNavbar/workshop.svg';

export const litsNavbarAdminSchoolRouter = [
  {
    id: 1,
    icon: <IconDashboard />,
    url: '/admin/school/dashboard',
    label: 'Trang chủ',
  },
  {
    id: 2,
    icon: <IconDepartment />,
    url: '/admin/school/department',
    label: 'Quản lý khoa',
  },
  {
    id: 3,
    icon: <IconBusiness />,
    url: '/admin/school/businessManagement',
    label: 'Quản lý ngành học',
  },
  {
    id: 4,
    icon: <IconSchool />,
    url: '/admin/school/schoolManagement',
    label: 'Quản lý hồ sơ trường',
  },
  {
    id: 5,
    icon: <IconAcademic />,
    url: '/admin/school/academicOfficeManagement',
    label: 'Quản lý giáo vụ',
  },
  {
    id: 6,
    icon: <IconStudent />,
    url: '/admin/school/studentsManagement',
    label: 'Quản lý sinh viên',
  },
  {
    id: 7,
    icon: <IconWorkshop />,
    url: '/admin/school/workshop',
    label: 'Quản lý work shop',
  },
  {
    id: 8,
    icon: <IconNotification />,
    url: '/admin/school/notification',
    label: 'Thông báo',
  },
  {
    id: 9,
    icon: <IconChangePassword />,
    url: '/admin/school/changePassword',
    label: 'Đổi mật khẩu',
  },
];
