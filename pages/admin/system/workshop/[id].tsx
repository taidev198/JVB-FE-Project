import Link from 'next/link';
import { FC } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { statusTextWorkshop } from '@/utils/app/const';
import { useGetDetailWorkshopQuery } from '@/services/adminSchoolApi';

const DetailWorkshop: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: workshop } = useGetDetailWorkshopQuery({ id: Number(id) });

  const agendaItems = workshop?.data.agenda.split(';').map(item => item.trim());

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
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin chi tiết Workshop </h1>
      <div className="px-20">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold">{workshop?.data.workshopTitle}</h1>
        </div>
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
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
          <div>
            <p>
              <span className="font-semibold">Lịch trình</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-col gap-1">
              {(agendaItems || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
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
          <div className="flex items-center gap-3">
            <span className="font-semibold">Trạng thái: </span>
            <Chip
              label={statusTextWorkshop(workshop?.data.moderationStatus)}
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
          <div>
            <span className="font-semibold">Hình ảnh:</span>
            <div className="mt-2 flex justify-evenly gap-4">
              {workshop?.data.imageWorkshops.map(image => (
                <Image src={image?.imageUrl} alt="Workshop" width={120} height={60} className="rounded" key={image.id} />
              ))}
            </div>
          </div>
          <p>
            <span className="font-semibold"> Mô tả:</span> <span>{workshop?.data.workshopDescription}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailWorkshop;
