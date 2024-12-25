import { Avatar, Badge, IconButton, Menu } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useState } from 'react';
import { useGetNotificationsQuery } from '@/services/adminSystemApi';
const Notification = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { data: notifications } = useGetNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
  console.log(notifications);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const renderNotification = (
    <Menu
      className="mt-3"
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
      <div className="max-h-[400px] w-[310px] overflow-y-auto">
        <div className="relative">
          <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-5 py-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary-black">Thông báo</p>
              <p className="cursor-pointer text-sm text-primary-main underline">Đánh dấu đã đọc</p>
            </div>
          </header>
        </div>
        <ul className="flex flex-col gap-2">
          {/* Mục thông báo */}
          {notifications?.data.map(notification => (
            <li className="flex flex-col items-center gap-1 px-5 py-2" key={notification?.id}>
              <div className="mr-auto flex items-center gap-2">
                <Avatar sx={{ width: 30, height: 30 }} />
                <p className="text-sm font-bold">Doanh nghiệp A</p>
              </div>
              <span className="mr-auto break-words text-sm text-gray-600">{notification?.notificationDescription}</span>
              <span className="mr-auto break-words text-sm text-gray-600">{notification?.createAt}</span>
            </li>
          ))}

          <hr />
        </ul>
      </div>
    </Menu>
  );

  const handleClickNotification = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Badge color="error" badgeContent={notifications?.data?.length} max={99}>
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
