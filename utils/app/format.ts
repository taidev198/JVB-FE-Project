import { format } from 'date-fns';

export const formatDate = (date: Date | null): string => {
  if (!date) {
    return ''; // Or any fallback value you prefer
  }
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};
