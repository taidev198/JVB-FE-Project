import { useRouter } from 'next/router';
import { Badge, IconButton, Menu } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useContext, useEffect, useState } from 'react';
import ImageComponent from './Image';
import { useGetNotificationsQuery, useUpdateStatusNotificationsMutation } from '@/services/adminSystemApi';
import { SocketContext } from '@/context/SoketProvider';
const Notification = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { messages } = useContext(SocketContext);
  const router = useRouter();
  const { data: notifications, refetch } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const notReadCount = notifications?.data.filter(notification => notification.isRead === false).length;

  const [updateStatusNotification] = useUpdateStatusNotificationsMutation();
  const handleUpdateStatus = () => {
    updateStatusNotification();
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      refetch();
    }
  }, [messages, refetch]);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderNotification = (
    <Menu
      className="mt-3 !py-0"
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
      <div>
        <header className="sticky top-0 z-10 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-primary-black">Thông báo</p>
            <p className="cursor-pointer text-sm font-semibold text-primary-main" onClick={handleUpdateStatus}>
              Đánh dấu đã đọc
            </p>
          </div>
        </header>
        <div className="max-h-[70vh] w-[90vw] overflow-y-auto p-5 py-0 sm:max-w-[410px]">
          <div className="relative"></div>
          <ul className="mt-2 flex flex-col gap-2">
            {notifications?.data?.length > 0 ? (
              notifications?.data.map(notification => (
                <li
                  className={`relative flex flex-col items-center gap-1 rounded-lg ${
                    notification.isRead === false ? 'bg-[#4897b615] hover:bg-[#35abda30]' : 'hover:bg-[#5b5a5a18]'
                  }  px-4 py-2 transition-all duration-500 ease-in-out`}
                  key={notification?.id}>
                  <div className="flex items-center gap-3">
                    <ImageComponent
                      src={
                        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                      }
                      alt={notification?.account?.email}
                      width={42}
                      height={42}
                      className="flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-[6px] text-[15px] leading-[18px]">
                      <span className="font-semibold text-[#333]">Doanh nghiệp A</span>{' '}
                      <p className="mr-auto break-words font-normal">{notification?.notificationDescription.split('.')[0]}.</p>
                      <p className="mr-auto break-words font-semibold text-[#f05123]">01/10/2024</p>
                    </div>
                  </div>
                  {notification.isRead === false && (
                    <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-[#35abda]"></div>
                  )}
                </li>
              ))
            ) : (
              <p className="text-center text-[#f05123]">Không có thông báo</p>
            )}
            <hr />
          </ul>
        </div>
        <div className="sticky top-0 z-10 flex items-center justify-center py-3 transition-all duration-200 ease-in-out hover:bg-[#cccccc56]">
          <p
            className="cursor-pointer font-semibold"
            onClick={() => {
              router.push('/admin/school/notification');
              handleMenuClose();
            }}>
            Xem tất cả thông báo
          </p>
        </div>
      </div>
    </Menu>
  );

  const handleClickNotification = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Badge color="error" badgeContent={notReadCount} max={99}>
        <div className="rounded-xl border border-solid border-[#666] p-0">
          <IconButton className="!p-1" onClick={handleClickNotification}>
            <NotificationsNoneIcon className="!flex items-center justify-center" />
          </IconButton>
        </div>
      </Badge>
      {renderNotification}
    </>
  );
};
export default Notification;
