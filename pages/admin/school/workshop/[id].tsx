import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { useGetDetailWorkshopQuery } from '@/services/adminSchoolApi';
import WorkshopDetail from '@/components/Admin/System/WorkshopDetail';

const AdminSchoolDetailWorkshop = () => {
  const id = useAppSelector(state => state.global.id);
  const { data: workshop } = useGetDetailWorkshopQuery({ id });
  return (
    <div className="rounded-2xl p-5 pb-[90px]">
      {/* Icon */}
      <div className="py-5">
        <Link href={'/admin/school/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>

      <WorkshopDetail workshop={workshop} />
    </div>
  );
};
export default AdminSchoolDetailWorkshop;
