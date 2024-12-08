export const API_SERVER_HOST = process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const roles = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  EMPLOYEE_COMPANY: 'EMPLOYEE_COMPANY',
  UNIVERSITY: 'UNIVERSITY',
  EMPLOYEE_UNIVERSITY: 'EMPLOYEE_UNIVERSITY',
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
