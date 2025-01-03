import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useBanAndActiveMutation, useRejectAccountCompanyMutation } from '@/services/adminSystemApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { setLoading } from '@/store/slices/global';

export const useAccountActionsCompanyAdminSystem = () => {
  const dispatch = useDispatch();
  const [banAndActiveAccount, { isLoading: isLoadingBanAndActive }] = useBanAndActiveMutation();
  const [reject, { isLoading: isLoadingReject }] = useRejectAccountCompanyMutation();

  const approveAccount = async ({ id, statusAccount }: { id: number; statusAccount: string }) => {
    try {
      await banAndActiveAccount({ id, statusAccount }).unwrap();
      toast.success('Tài khoản đã được duyệt thành công.');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  const rejectAccount = async ({ id }: { id: number }) => {
    try {
      await reject({ id }).unwrap();
      toast.success('Yêu cầu duyệt tài khoản đã bị từ chối.');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  const lockAccount = async ({ id, statusAccount }: { id: number; statusAccount: string }) => {
    try {
      await banAndActiveAccount({ id, statusAccount }).unwrap();
      toast.success('Tài khoản đã được mở khóa thành công.');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  const unlockAccount = async ({ id, statusAccount }: { id: number; statusAccount: string }) => {
    try {
      await banAndActiveAccount({ id, statusAccount }).unwrap();
      toast.success('Tài khoản đã bị khóa thành công.');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoadingBanAndActive || isLoadingReject));
  }, [dispatch, isLoadingBanAndActive, isLoadingReject]);

  return { approveAccount, rejectAccount, lockAccount, unlockAccount };
};
