import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearToast } from '@/store/slices/toastSlice';
import { useAppSelector } from '@/store/hooks';

function ToastNotification() {
  const dispatch = useDispatch();
  const { message, type } = useAppSelector(state => state.toast);

  useEffect(() => {
    if (message) {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }

      // Clear the toast after showing it
      setTimeout(() => {
        dispatch(clearToast());
      }, 3000); // Thời gian toast hiển thị là 3 giây
    }
  }, [message, type, dispatch]);

  return null; // Component này chỉ hiển thị thông báo khi có dữ liệu trong store
}

export default ToastNotification;
