import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logOut as logOutAction } from '@/store/slices/user';

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(logOutAction());
    router.replace('/auth/login');
  };
  return { logOut };
};
