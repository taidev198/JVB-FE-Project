import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect } from 'react';
import { setLoading } from '@/store/slices/global';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useDetailDepartmentsQuery } from '@/services/adminSchoolApi';

const DetailDepartment = () => {
  const idDepartment = useAppSelector(state => state.global.id);
  const dispatch = useAppDispatch();
  const { data: departments, isLoading } = useDetailDepartmentsQuery({ id: idDepartment });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  console.log(departments);

  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/school/department'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin quản lý khoa </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin Khoa</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <StarBorderIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã khoa:</span> {departments?.data.facultyCode}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tên khoa:</span>
              {departments?.data.facultyName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <AssignmentIndIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Tên trưởng khoa:</span> {departments?.data.nameDean}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Năm thành lập:</span> {departments?.data.establishYear}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <CameraOutdoorIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {departments?.data.address}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <DescriptionIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mô tả:</span>
              {departments?.data.facultyDescription}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default DetailDepartment;
