import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BackDrop } from '@/components/Common/BackDrop';
import { setBackdrop } from '@/store/slices/global';

import { useGetDetailWorkshopQuery } from '@/services/adminSystemApi';
import { statusTextWorkshop } from '@/utils/app/const';
import ImageComponent from '@/components/Common/Image';

interface DetailWorkshopProps {
  idWorkshop: number | null;
}
const DetailWorkshop: FC<DetailWorkshopProps> = ({ idWorkshop }) => {
  const dispatch = useDispatch();
  const { data: workshop } = useGetDetailWorkshopQuery({ id: idWorkshop });
  const agendaItems = workshop?.data.agenda.split(';').map(item => item.trim());

  return (
    <BackDrop isCenter={true}>
      <div className="p-5 text-[15px] text-black">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold">{workshop?.data.workshopTitle}</h1>
          <IconButton>
            <CloseIcon onClick={() => dispatch(setBackdrop(null))} className="ml-auto" />
          </IconButton>
        </div>
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
          <p>
            <span className="font-semibold"> Mô tả:</span> <span>{workshop?.data.workshopDescription}</span>
          </p>
          {/*  */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <p>
              <span className="font-semibold">Thời gian bắt đầu:</span> <span>{workshop?.data.startTime}</span>
            </p>
            <p>
              <span className="font-semibold">Thời gian kết thúc:</span> <span>{workshop?.data.endTime}</span>
            </p>
            <p>
              <span className="font-semibold">Số lượng công ty ước tính:</span> <span>{workshop?.data.estimateCompanyParticipants}</span>
            </p>
            <p>
              <span className="font-semibold">Địa điểm tổ chức:</span>
              <span>
                {workshop?.data.address.houseNumber},{workshop?.data.address.province.provinceName},{workshop?.data.address.district.districtName},
                {workshop?.data.address.ward.wardName}
              </span>
            </p>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold"> Mô tả: {workshop?.data.workshopDescription}</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-col gap-1">
              {(agendaItems || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold">Lĩnh vực:</span>
            </p>
            <ul className="ml-3 mt-3 flex gap-4">
              <Chip label="Công nghệ" color="primary" />
              <Chip label="Tài chính" color="primary" />
              <Chip label="Khoa học" color="primary" />
            </ul>
          </div>
          {/*  */}
          <div className="flex items-center gap-3">
            <span className="font-semibold">Trạng thái: </span>
            <Chip
              label={statusTextWorkshop(workshop?.data.moderationStatus)?.title}
              color={
                workshop?.data.moderationStatus === 'APPROVED'
                  ? 'success'
                  : workshop?.data.moderationStatus === 'PENDING'
                  ? 'warning'
                  : workshop?.data.moderationStatus === 'REJECTED'
                  ? 'error'
                  : 'default'
              }
            />
          </div>
          {/*  */}
          <div>
            <span className="font-semibold">Hình ảnh:</span>
            <div className="mt-2 flex justify-evenly gap-4">
              {workshop?.data.imageWorkshops.map(image => (
                <ImageComponent src={image?.imageUrl} alt={workshop.data?.workshopTitle} width={80} height={80} className="rounded" key={image.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BackDrop>
  );
};
export default DetailWorkshop;
