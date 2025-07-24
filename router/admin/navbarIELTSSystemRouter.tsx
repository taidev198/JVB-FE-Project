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
    label: 'Dashboard',
  },
  {
    id: 2,
    icon: <IconGroup />,
    url: '/admin/system/company',
    label: 'Speaking',
  },
  {
    id: 3,
    icon: <IconSchool />,
    url: '/admin/system/school',
    label: 'Reading',
  },
  {
    id: 4,
    icon: <IconWorkshop />,
    url: '/admin/system/workshop',
    label: 'Writing',
  },
  {
    id: 5,
    icon: <IconJob />,
    url: '/admin/system/job',
    label: 'Listening',
  },
  {
    id: 66,
    icon: <IconNotification />,
    url: '/admin/system/notification',
    label: 'Exercise',
  },
  {
    id: 77,
    icon: <IconChangePassword />,
    url: '/admin/system/change-password',
    label: 'Mock Test',
  },
  {
    id: 78,
    icon: <IconChangePassword />,
    url: '/admin/ielts/vocab-progress',
    label: 'Vocabulary',
  },
  {
    id: 79,
    icon: <IconChangePassword />,
    url: '/admin/system/change-password',
    label: 'Grammar',
  },
  {
    id: 80,
    icon: <IconChangePassword />,
    url: '/admin/system/change-password',
    label: 'Mock Test',
  },
];
