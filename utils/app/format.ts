import { format, isValid } from 'date-fns';
import { parse } from 'date-fns';
import dayjs from 'dayjs';

export const formatDate = (date: string | null): string => {
  if (!date) {
    return '';
  }
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatDateWorkshop = (date: string | null): string => {
  if (!date) {
    return '';
  }

  const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');

  if (!dayjs(date).isValid()) {
    return '';
  }

  return formattedDate;
};

export const toISOString = (date: string): string => {
  const parsedDate = parse(date, 'dd/MM/yyyy HH:mm:ss', new Date());
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatDateSearch = (date: Date | null | string): string | null => {
  return date ? format(date, 'yyyy-MM-dd') : null;
};

export const formatDateDd_MM_yyyy = (date: Date | string | null): string | null => {
  if (!date) {
    return null;
  }

  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
    if (!isValid(dateObj)) {
      return null;
    }
  } else {
    dateObj = date;
  }

  return format(dateObj, 'dd/MM/yyyy');
};

export const formatJobType = (jobType?: string): string => {
  if (!jobType) return '';
  return jobType
    .toLowerCase() // Biến tất cả thành chữ thường: 'full_time' -> 'full time'
    .split('_') // Tách chuỗi theo dấu gạch dưới: ['full', 'time']
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu: ['Full', 'Time']
    .join(' '); // Ghép lại thành chuỗi: 'Full Time'
};

export const convertSchoolType = (schoolType: string): string => {
  const schoolTypeMapping: Record<string, string> = {
    ACADEMY: 'Học viện',
    COLLEGE: 'Cao đẳng',
    UNIVERSITY: 'Đại học',
    OTHER: 'Khác',
  };
  return schoolTypeMapping[schoolType] || 'Không xác định';
};

export const formatJobLevel = (jobLever: string): string => {
  const jobLeverMapping: Record<string, string> = {
    INTERN: 'Intern',
    FRESHER: 'Freshers',
    JUNIOR: 'Junior',
    MIDDLE: 'Middle',
    SENIOR: 'Senior',
  };
  return jobLeverMapping[jobLever] || 'Chưa xác định';
};

export const formatDateDD_thang_MM_yyyy = (dateTimeStr: string | null): string => {
  if (!dateTimeStr) {
    return '';
  }

  const date = new Date(dateTimeStr);
  const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

  return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

export const formatSalaryVND = (amount: number): string => {
  return `${(amount / 1_000_000).toFixed()} triệu`;
};

export const formatCurrencyVND = (value: number | null) => {
  return value ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : null;
};

export const formatWorkshopStatus = (status: string): string => {
  const statusMapping: Record<string, string> = {
    UPCOMING: 'Sắp diễn ra',
    ONGOING: 'Đang diễn ra',
    FINISHED: 'Đã diễn ra',
    CANCELLED: 'Huỷ',
  };
  return statusMapping[status] || 'Không xác định';
};
