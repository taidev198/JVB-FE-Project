import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppSelector } from '@/store/hooks';
import { useGetDetailWorkshopQuery } from '@/services/adminSchoolApi';
import { BackdropType, setBackdrop, setImage } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';

const AdminSchoolDetailWorkshop = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const imageURL = useAppSelector(state => state.global.image);
  const id = useAppSelector(state => state.global.id);
  const { data: workshop } = useGetDetailWorkshopQuery({ id });
  return (
    <div className="rounded-xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-1 sm:p-5">
        <Link href={'/admin/school/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mt-3 text-center text-xl font-bold sm:text-2xl">Thông tin chi tiết WorkShop</h1>
      {/* Info */}
      <div className="px-3 py-6 text-[15px] text-black sm:px-24 sm:py-12">
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
          <div className="flex justify-between">
            <h1 className="text-md font-bold sm:text-lg">{workshop?.data.workshopTitle}</h1>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <p>
              <span className="font-semibold">Thời gian bắt đầu:</span> <span>{workshop?.data.startTime}</span>
            </p>
            <p>
              <span className="font-semibold">Thời gian kết thúc:</span> <span>{workshop?.data.endTime}</span>
            </p>
            <p>
              <span className="font-semibold">Địa điểm tổ chức:</span>
              <span>
                {workshop?.data.address.houseNumber}, {workshop?.data.address.ward.wardName}, {workshop?.data.address.district.districtName},
                {workshop?.data.address.province.provinceName}
              </span>
            </p>

            <p>
              <span className="font-semibold">Trường học tổ chức:</span> <span>{workshop?.data.university.universityName}</span>
            </p>
            <p>
              <span className="font-semibold">Số lượng công ty ước tính:</span> <span>{workshop?.data.estimateCompanyParticipants}</span>
            </p>
          </div>
          {/* Description */}
          <p>
            <span className="font-semibold"> Mô tả:</span> <p dangerouslySetInnerHTML={{ __html: workshop?.data.workshopDescription ?? '' }}></p>
          </p>
          <div>
            {/* field */}
            <p>
              <span className="font-semibold">Lĩnh vực:</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-wrap gap-4">
              {workshop?.data.fields.map(field => (
                <Chip label={field.fieldName} color="info" variant="outlined" key={field.id} />
              ))}
            </ul>
          </div>
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="font-semibold">Trạng thái:</span>
            <Chip label="Đã duyệt" color="success" />
          </div>
          {/* schedule */}
          <div>
            <p>
              <span className="font-semibold">Lịch trình:</span>
            </p>
            <p dangerouslySetInnerHTML={{ __html: workshop?.data.agenda ?? '' }}></p>
          </div>
          {/* Image */}
          <div>
            <span className="font-semibold">Hình ảnh:</span>
            <div className="mt-2 flex flex-wrap justify-evenly gap-4">
              {workshop?.data.imageWorkshops.map(image => (
                <Image
                  src={image.imageUrl ?? ''}
                  alt="Workshop"
                  width={140}
                  height={140}
                  className="cursor-pointer rounded"
                  key={image.id}
                  onClick={() => {
                    dispatch(setImage(image.imageUrl));
                    dispatch(setBackdrop(BackdropType.AddModal));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {backdropType === BackdropType.AddModal && (
        <BackDrop isCenter={true}>
          <div className="relative">
            <div className="absolute right-1" onClick={() => dispatch(setBackdrop(null))}>
              <ClearIcon className="cursor-pointer" />
            </div>
            <Image src={imageURL ?? ''} alt="Workshop" width={600} height={600} className="rounded" />
          </div>
        </BackDrop>
      )}
    </div>
  );
};
export default AdminSchoolDetailWorkshop;
