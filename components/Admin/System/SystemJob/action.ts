import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useApproveJobsMutation, useRejectJobsMutation } from '@/services/adminSystemApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { setLoading } from '@/store/slices/global';

export const ActionJobAdminSystem = () => {
  const dispatch = useDispatch();
  const [approve, { isLoading: isLoadingApprove }] = useApproveJobsMutation();
  const [reject, { isLoading: isLoadingReject }] = useRejectJobsMutation();

  const approveJob = async ({ id }: { id: number }) => {
    try {
      await approve({ id }).unwrap();
      toast.success('Duyệt job thành công.');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    }
  };

  const rejectJob = async ({ id }: { id: number }) => {
    try {
      await reject({ id }).unwrap();
      toast.success('Từ chối job thành công.');
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
    dispatch(setLoading(isLoadingApprove || isLoadingReject));
  }, [dispatch, isLoadingApprove, isLoadingReject]);

  return { approveJob, rejectJob };
};
