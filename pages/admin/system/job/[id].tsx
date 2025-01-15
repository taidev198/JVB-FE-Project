import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import { useGetJobDetailsQuery } from '@/services/portalHomeApi';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { ActionJobAdminSystem } from '@/components/Admin/System/SystemJob/action';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import DetailJobComponent from '@/components/Admin/System/SystemJob/DetailJobComponent';

const DetailJobCompany = () => {
  const name = useAppSelector(state => state.global.name);
  const idJobCompany = useAppSelector(state => state.global.id);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useAppDispatch();

  const { data: jobCompany, isLoading } = useGetJobDetailsQuery({ id: idJobCompany }, { refetchOnMountOrArgChange: true });
  const { approveJob, rejectJob } = ActionJobAdminSystem();
  const handleConfirmAction = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            await approveJob({ id: idJobCompany });
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await rejectJob({ id: idJobCompany });
            break;
          }
          default:
            throw new Error('Invalid action type');
        }
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
          toast.error(errMsg);
        } else if (isErrorWithMessage(error)) {
          toast.error(error.message);
        }
      } finally {
        dispatch(setBackdrop(null));
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <>
      <DetailJobComponent jobDetail={jobCompany} href={'/admin/system/job'} IsAdmin={true} />
      {showBackdrop && (
        <PopupConfirmAction
          name={name}
          text={showBackdrop === BackdropType.ApproveConfirmation ? 'Duyệt' : showBackdrop === BackdropType.RefuseConfirmation ? 'Từ chối' : ''}
          onClick={() => handleConfirmAction()}
        />
      )}
    </>
  );
};

export default DetailJobCompany;
