import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
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
