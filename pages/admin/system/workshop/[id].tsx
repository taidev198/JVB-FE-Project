import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { Chip, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ClearIcon from '@mui/icons-material/Clear';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchIcon from '@mui/icons-material/Watch';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TrafficIcon from '@mui/icons-material/Traffic';
import ImageIcon from '@mui/icons-material/Image';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { FC, useEffect } from 'react';
import { statusTextWorkshop } from '@/utils/app/const';
import { useGetDetailWorkshopQuery } from '@/services/adminSchoolApi';
import { BackdropType, setBackdrop, setImage, setLoading } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { useAppSelector } from '@/store/hooks';
import ImageComponent from '@/components/Common/Image';

const DetailWorkshop: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const imageURL = useAppSelector(state => state.global.image);
  const { data: workshop, isLoading } = useGetDetailWorkshopQuery({ id: Number(id) });

  const agendaItems = workshop?.data.agenda.split(';').map(item => item.trim());

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin chi tiết workshop </h1>
      <div className="p-4 sm:px-20">
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">{workshop?.data.workshopTitle}</h1>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <p className="flex items-center gap-1">
              <AccessAlarmIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Thời gian bắt đầu:</span> <span>{workshop?.data.startTime}</span>
            </p>
            <p className="flex items-center gap-1">
              <AccessAlarmIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Thời gian kết thúc:</span> <span>{workshop?.data.endTime}</span>
            </p>
            <p className="flex items-center gap-1">
              <InterpreterModeIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Số lượng công ty ước tính:</span> <span>{workshop?.data.estimateCompanyParticipants}</span>
            </p>
            <p className="flex">
              <LocationOnIcon sx={{ color: '#757575' }} />
              <div className="flex">
                <p className="mr-2 min-w-fit font-semibold">Địa chỉ:</p>
                <p>
                  {workshop?.data.address.houseNumber},{workshop?.data.address.province.provinceName},{workshop?.data.address.district.districtName},
                  {workshop?.data.address.ward.wardName}
                </p>
              </div>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1">
              <WatchIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Lịch trình:</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-col gap-1">
              {(agendaItems || []).map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-1">
              <WidgetsIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Lĩnh vực:</span>
              <ul className="ml-3 mt-3 flex flex-wrap gap-4">
                <Chip label="Công nghệ" color="primary" variant="outlined" />
                <Chip label="Tài chính" color="primary" variant="outlined" />
                <Chip label="Khoa học" color="primary" variant="outlined" />
              </ul>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TrafficIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Trạng thái: </span>
            </div>
            <Chip
              label={statusTextWorkshop(workshop?.data.moderationStatus).title}
              style={{
                color: `${statusTextWorkshop(workshop?.data.moderationStatus).color}`,
                background: `${statusTextWorkshop(workshop?.data.moderationStatus).bg}`,
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <ImageIcon sx={{ color: '#757575' }} />
              <span className="font-semibold">Hình ảnh:</span>
            </div>
            <div className="mt-2 flex justify-evenly gap-4">
              {workshop?.data.imageWorkshops.map(image => (
                <ImageComponent
                  src={image?.imageUrl}
                  alt={image.imageUrl}
                  width={120}
                  height={80}
                  onclick={() => {
                    dispatch(setImage(image?.imageUrl));
                    dispatch(setBackdrop(BackdropType.AddModal));
                  }}
                  className="cursor-pointer rounded"
                  key={image.id}
                />
              ))}
            </div>
          </div>
          <p className="flex gap-3">
            <LightbulbIcon sx={{ color: '#757575' }} />
            <div className="flex">
              <p className="mr-2 min-w-fit font-semibold">Mô tả:</p>
              <p>
                <span dangerouslySetInnerHTML={{ __html: workshop?.data.workshopDescription || '' }} />
              </p>
            </div>
          </p>
        </div>
        {backdropType === BackdropType.AddModal && (
          <BackDrop isCenter={true}>
            <div className="relative">
              <div className="absolute right-1" onClick={() => dispatch(setBackdrop(null))}>
                <ClearIcon className="cursor-pointer text-[#ccc] transition-all hover:text-[#666]" />
              </div>
              <ImageComponent src={imageURL} alt="Workshop" width={600} height={500} className="rounded object-cover" />
            </div>
          </BackDrop>
        )}
      </div>
    </div>
  );
};

export default DetailWorkshop;
