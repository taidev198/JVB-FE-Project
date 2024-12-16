import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';

import Link from 'next/link';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';

import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { setLoading } from '@/store/slices/global';
import { useGetDetailBusinessQuery } from '@/services/adminSchoolApi';
const DetalBusinessManagement = () => {
  const idBusiness = useAppSelector(state => state.global.id);
  const dispatch = useAppDispatch();
  const { data: business, isLoading } = useGetDetailBusinessQuery({ id: idBusiness });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/school/businessManagement'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin quản lý ngành học </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin ngành học</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <StarBorderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã ngành:</span> {business?.data.majorCode}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tên Ngành:</span>
              {business?.data.majorName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <CreditScoreIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số Tín Chỉ :</span> {business?.data.creditRequirement}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <FaceRetouchingNaturalIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số Sinh Viên:</span> {business?.data.numberOfStudents}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Khoa:</span>
              {business?.data.faculty.facultyName}
            </div>
          </li>
          <li className="mt-4 flex items-center gap-3">
            <TextFieldsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Lĩnh vực:</span>
              <div className="  flex flex-wrap gap-2">
                {business?.data.majorFields.map((i, index) => (
                  <Chip key={index} label={i.fieldName} variant="outlined" color="primary" sx={{ fontSize: '14px' }} />
                ))}
              </div>
            </div>
          </li>

          <li className="mt-5 flex  items-center gap-3 ">
            <DescriptionIcon sx={{ color: '#757575' }} />
            <div className="mt-5">
              <span className="mr-2 font-semibold">Mô tả:</span>
              {business?.data.majorDescription}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetalBusinessManagement;
