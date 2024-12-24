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
  { value: 'OTHER', label: 'Khác' },
];

export const positionEmployee = [
  { value: 'INTERN', label: 'Intern' },
  { value: 'FRESHER', label: 'Fresher' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
];

export const genderTitle = (gender: string | undefined): string => {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    case 'OTHER':
      return 'Khác';
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

export const statusEmployee = (status: string): AccountStatus => {
  switch (status) {
    case 'WORKING':
      return { title: 'đang làm', color: '#fff', bg: '#ed6c02' };
      case 'INACTIVE':
        return { title: 'Nghỉ việc', color: '#fff', bg: '#2e7d32' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};

export const StatusJob = (status: string): AccountStatus => {
  switch (status) {
    case 'PENDING':
      return { title: 'Đang chờ', color: '#fff', bg: '#ed6c02' };
    case 'ACCEPT':
      return { title: 'Thành công', color: '#fff', bg: '#2e7d32' };
    case 'CANCEL':
      return { title: 'Đã hủy', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};

export const typeAccount = (status: string): AccountStatus => {
  switch (status) {
    case 'PENDING':
      return { title: 'Chờ duyệt', color: '#FFA726', bg: '#fffae5' };
    case 'ACTIVE':
      return { title: 'Hoạt động', color: '#359d65', bg: '#ebf9f1' };
    case 'BAN':
      return { title: 'Ngừng hoạt động', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};

export const statusTextWorkshop = (status: string): AccountStatus => {
  switch (status) {
    case 'APPROVED':
      return { title: 'Đã duyệt', color: '#359d65', bg: '#ebf9f1' };
    case 'PENDING':
      return { title: 'Đang chờ', color: '#FFA726', bg: '#fffae5' };
    case 'REJECTED':
      return { title: 'Từ chối', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};
export const statusTextJob = (status: string): AccountStatus => {
  switch (status) {
    case 'ACCEPT':
      return { title: 'Đã duyệt', color: '#359d65', bg: '#ebf9f1' };
    case 'PENDING':
      return { title: 'Đang chờ', color: '#FFA726', bg: '#fffae5' };
    case 'CANCEL':
      return { title: 'Từ chối', color: '#d32f2f', bg: '#FFE5E5' };
    default:
      return { title: 'Chưa xác định', color: '#fff', bg: '#FFF4E5' };
  }
};
export const jobType = (status: string | undefined): string => {
  switch (status) {
    case 'FULL_TIME':
      return 'Toàn thời gian';
    case 'PART_TIME':
      return 'Bán thời gian';
    case 'FREELANCE':
      return 'Tự do';
    default:
      return 'Chưa xác định';
  }
};

export const jobLever = (status: string | undefined): string => {
  switch (status) {
    case 'INTERN':
      return 'Toàn thời gian';
    case 'FRESHER':
      return 'Bán thời gian';
    case 'JUNIOR':
      return 'Tự do';
    case 'MIDDLE':
      return 'Tự do';
    case 'SENIOR':
      return 'Tự do';
    default:
      return 'Chưa xác định';
  }
};
