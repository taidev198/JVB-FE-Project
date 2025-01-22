import { useDispatch } from 'react-redux';
import { Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LightModeIcon from '@mui/icons-material/LightMode';
import { BackdropType, setBackdrop, setImage } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import ImageComponent from '@/components/Common/Image';
import { statusTextWorkshop } from '@/utils/app/const';
import { useAppSelector } from '@/store/hooks';
import { WorkshopDetailResponse } from '@/types/workshop';

interface WorkshopDetailProps {
  workshop: WorkshopDetailResponse;
}

const WorkshopDetail: React.FC<WorkshopDetailProps> = React.memo(({ workshop }) => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const imageURL = useAppSelector(state => state.global.image);
  const agendaItems = workshop?.data.agenda.split(';').map(item => item.trim());

  return (
    <div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-md bg-white">
            <div className="">
              <ImageComponent
                src={workshop?.data.imageWorkshops[0].imageUrl}
                alt={workshop?.data.workshopTitle}
                height={480}
                className="w-full rounded-t-md object-cover"
              />
            </div>
            <div className="p-7">
              <span dangerouslySetInnerHTML={{ __html: workshop?.data.workshopDescription || '' }} />
              <ul className="mt-3 flex flex-col gap-1">
                {(agendaItems || []).map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                ))}
              </ul>
              <div className="mt-5">
                <p className="font-semibold">Lĩnh vực</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {workshop?.data.fields.map(field => (
                    <div className="" key={field.id}>
                      <Chip label={field.fieldName} color="primary" variant="outlined" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Photos */}
          <div className="mt-7 rounded-md bg-white ">
            <p className="p-7 font-semibold">Hình ảnh</p>
            <div className="grid grid-cols-2 border-t border-solid p-7">
              {(workshop?.data.imageWorkshops.slice(1) || []).map(image => (
                <ImageComponent
                  src={image?.imageUrl}
                  alt={image.imageUrl}
                  height={250}
                  onclick={() => {
                    dispatch(setImage(image?.imageUrl));
                    dispatch(setBackdrop(BackdropType.AddModal));
                  }}
                  className="w-full cursor-pointer rounded object-cover transition-all hover:opacity-90"
                  key={image.id}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-12 h-fit rounded-md bg-white lg:col-span-4">
          <div className="border-b border-solid">
            <p className="p-7 text-lg font-semibold">Chi tiết workshop</p>
          </div>
          <div className="px-7">
            <div className="flex items-center gap-5 border-b border-solid py-7">
              <SchoolIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Trường học</span>
                <span className="text-xs text-[#888]">{workshop?.data.university.universityName}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <CalendarMonthIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Thời gian bắt đầu</span>
                <span className="text-xs text-[#888]">{workshop?.data.startTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <CalendarMonthIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Thời gian kết thúc</span>
                <span className="text-xs text-[#888]">{workshop?.data.endTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <PeopleAltIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Quy mô</span>
                <span className="text-xs text-[#888]">{workshop?.data.estimateCompanyParticipants} doanh nghiệp</span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <LocationOnIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Vị trí</span>
                <span className="text-xs text-[#888]">{workshop?.data.address.province.provinceName}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <MapIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Địa điểm</span>
                <span className="text-xs text-[#888]">
                  {workshop?.data.address.houseNumber}, {workshop?.data.address.ward.wardName}, {workshop?.data.address.district.districtName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 border-b border-solid py-7">
              <LightModeIcon fontSize="large" style={{ color: 'rgb(52, 168, 83)' }} />
              <div className="flex flex-col gap-2">
                <span className="font-medium">Trạng thái</span>
                <span className="text-xs text-[#888]">{statusTextWorkshop(workshop?.data.moderationStatus).title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:px-20">
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
});
export default WorkshopDetail;
