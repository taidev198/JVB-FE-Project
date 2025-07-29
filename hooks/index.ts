import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useRef, useCallback } from 'react';
import { useLogoutMutation } from '@/services/portalHomeApi';
import debounce from 'lodash/debounce';
import { logOut as logOutAction } from '@/store/slices/user';

export const useLogout = () => {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = async () => {
    // Call the logout API
    await logout().unwrap();
    dispatch(logOutAction());
    router.replace('/auth/login');
  };
  return { logOut };
};

export const useDebounce = (callback, delay) => {
  const debouncedCallback = useRef(
    debounce((...args) => {
      callback(...args);
    }, delay)
  ).current;

  const cancelDebounce = useCallback(() => {
    debouncedCallback.cancel();
  }, [debouncedCallback]);

  return [debouncedCallback, cancelDebounce];
};
