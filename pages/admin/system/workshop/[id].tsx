import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useGetDetailWorkshopQuery } from '@/services/adminSchoolApi';
import { setLoading } from '@/store/slices/global';
import WorkshopDetail from '@/components/Admin/System/WorkshopDetail';

const DetailWorkshop: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { data: workshop, isLoading } = useGetDetailWorkshopQuery({ id: Number(id) });

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-2xl bg-white p-5 pb-[90px] ">
      {/* Icon */}
      <div className="py-5">
        <Link href={'/admin/system/workshop'}>
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

export default DetailWorkshop;
