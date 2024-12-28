import { useGetNotificationsQuery, useUpdateStatusNotificationsMutation } from '@/services/adminSystemApi';
import ImageComponent from '@/components/Common/Image';

const NotificationPage = () => {
  const { data: notifications } = useGetNotificationsQuery(
    { undefined },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [updateStatusNotification] = useUpdateStatusNotificationsMutation();
  const handleUpdateStatus = () => {
    updateStatusNotification();
  };

  return (
    <div className="mx-auto w-[66.6666666667%] bg-[#f9f9f9f2] p-3 shadow-md">
      <header className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-primary-black">Thông báo</p>
          <p className="cursor-pointer text-sm font-semibold text-primary-main" onClick={handleUpdateStatus}>
            Đánh dấu đã đọc
          </p>
        </div>
      </header>
      <div className="">
        <ul className="mt-2 flex flex-col gap-2">
          {notifications?.data?.length > 0 ? (
            notifications?.data.map(notification => (
              <li
                className={`relative flex flex-col items-center gap-1 rounded-lg ${
                  notification.isRead === false ? 'bg-[#4897b615] hover:bg-[#35abda30]' : 'hover:bg-[#5b5a5a18]'
                }  px-4 py-2 transition-all duration-500 ease-in-out`}
                key={notification?.id}>
                <div className="flex w-full items-center gap-3">
                  <ImageComponent
                    src={
                      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }
                    alt={notification?.account?.email}
                    width={50}
                    height={50}
                    className="flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-[6px] text-[15px] leading-[18px]">
                    <span className="font-semibold text-[#333]">Doanh nghiệp A</span>{' '}
                    <p className="mr-auto break-words font-normal tracking-wider">{notification?.notificationDescription}</p>
                    <p className="mr-auto break-words font-semibold text-[#f05123]">01/10/2024</p>
                  </div>
                </div>
                {notification.isRead === false && <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-[#35abda]"></div>}
              </li>
            ))
          ) : (
            <p className="text-center">Không có thông báo</p>
          )}
        </ul>
      </div>
    </div>
  );
};
export default NotificationPage;
