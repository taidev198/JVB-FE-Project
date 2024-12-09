import { format } from 'date-fns';
import { parse } from 'date-fns';

export const formatDate = (date: string | null): string => {
  if (!date) {
    return ''; // Or any fallback value you prefer
  }
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

export const toISOString = (date: string): string => {
  const parsedDate = parse(date, 'dd/MM/yyyy HH:mm:ss', new Date());
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
};

export const formatDateSearch = (date: Date | null): string | null => {
  return date ? format(date, 'yyyy-MM-dd') : null;
};
