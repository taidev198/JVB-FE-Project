import { useGetNotificationsQuery } from '@/services/adminSystemApi';

const Notification = () => {
  const { data: notifications } = useGetNotificationsQuery(
    { undefined },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  return <div>notification</div>;
};
export default Notification;
