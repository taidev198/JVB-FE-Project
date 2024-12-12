export const API_SERVER_HOST = process.env.OPENAI_API_HOST || 'https://api.openai.com';
interface AccountStatus {
  title: string;
  color: string;
  bg: string;
}

export const roles = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  EMPLOYEE_COMPANY: 'EMPLOYEE_COMPANY',
  UNIVERSITY: 'UNIVERSITY',
  EMPLOYEE_UNIVERSITY: 'EMPLOYEE_UNIVERSITY',
};

// export const gender = ['MALE', 'FEMALE', 'THREE_GENDER'];
export const gender = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'THREE_GENDER', label: 'Khác' },
];

export const genderTitle = (gender: string | undefined): string => {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    case 'THREE_GENDER':
      return 'Khác';
    default:
      return 'Chưa xác định';
  }
};

export const statusTextWorkshop = (status: string | undefined): string => {
  switch (status) {
    case 'APPROVED':
      return 'Đã duyệt';
    case 'PENDING':
      return 'Chờ duyệt';
    case 'REJECTED':
      return 'Từ chối';
    default:
      return 'Chưa xác định';
  }
};

export const StatusStudent = (status: string | undefined): string => {
  switch (status) {
    case 'GRADUATED':
      return 'Đã tốt nghiệp';
    case 'IN_PROGRESS':
      return 'Đang học';
    case 'DROPPED_OUT':
      return 'Bỏ học';
    default:
      return 'Chưa xác định';
  }
};

export const typeUniversity = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: 'UNIVERSITY',
    label: 'Đại học',
  },
  {
    value: 'ACADEMY',
    label: 'Học viện',
  },
  {
    value: 'COLLEGE',
    label: 'Cao đẳng',
  },
  {
    value: 'OTHER',
    label: 'Khác',
  },
];

export const typeUniversityTitle = (status: string): AccountStatus => {
  switch (status) {
    case 'UNIVERSITY':
      return { title: 'Đại học', color: '#fff', bg: '#ed6c02' };
    case 'ACADEMY':
      return { title: 'Học viện', color: '#fff', bg: '#2e7d32' };
    case 'COLLEGE':
      return { title: 'Cao đẳng', color: '#d32f2f', bg: '#FFE5E5' };
    case 'OTHER':
      return { title: 'Khác', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};

export const typeAccount = (status: string): AccountStatus => {
  switch (status) {
    case 'PENDING':
      return { title: 'Chờ duyệt', color: '#fff', bg: '#ed6c02' };
    case 'ACTIVE':
      return { title: 'Hoạt động', color: '#fff', bg: '#2e7d32' };
    case 'BAN':
      return { title: 'Ngừng hoạt động', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};
