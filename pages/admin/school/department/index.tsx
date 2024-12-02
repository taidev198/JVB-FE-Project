import React, { useState } from 'react';
import { IconButton, Tooltip, Pagination, TextField } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import AddDepartment from '@/components/Admin/school/Department/AddDepartment';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
const Department = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);

  // Data giả lập
  const mockData = [
    { faculty_code: 'CNTT', faculty_name: 'Công Nghệ Thông Tin', name_dean: 'TS.Nguyễn Ánh Bích', established_year: 2000 },
    { faculty_code: 'MKT', faculty_name: 'Marketing', name_dean: 'TS.Nguyễn Văn A', established_year: 20010 },
    { faculty_code: 'TKDH', faculty_name: 'Thiết Kế Đồ Họa', name_dean: 'TS.Hồ Văn C', established_year: 2011 },
    { faculty_code: 'TY', faculty_name: 'Thú Y', name_dean: 'TS.Ngô Văn Bình', established_year: 1992 },
    { faculty_code: 'KCH', faculty_name: 'Khảo Cổ Học', name_dean: 'TS.Khổng Văn D', established_year: 1978 },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý khoa</h1>
        <div className="flex items-center justify-between gap-3 ">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" />
          <MyButton type="submit" text="Thêm mới" onClick={() => dispatch(setBackdrop(BackdropType.AddModal))} />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã Khoa</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Tên Khoa</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Trưởng Khoa</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Năm Thành Lập</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Thao Tác</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr key={item.faculty_code} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.faculty_code}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.faculty_name}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.name_dean}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.established_year}</p>
                </td>
                <td className="gap-2 px-2 py-4 sm:px-5 ">
                  <div className="flex items-center">
                    <p className="min-w-max">
                      <Tooltip title="Xem chi tiết">
                        <IconButton onClick={() => dispatch(setBackdrop(BackdropType.General))}>
                          <VisibilityIcon color="success" />
                        </IconButton>
                      </Tooltip>

                      <Link href={`/admin/school/department/update`}>
                        <Tooltip title="Sửa khoa">
                          <IconButton>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Xóa khoa">
                        <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </Tooltip>
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Xóa Khoa */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn khoa khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} />
            </div>
          </div>
        </BackDrop>
      )}
      {/* DetailDepartment */}
      {backdropType === BackdropType.General && (
        <BackDrop isCenter={true}>
          <div className="relative">
            <IconButton onClick={() => dispatch(setBackdrop(null))} className="absolute right-0 mr-auto">
              <CloseIcon />
            </IconButton>
            <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin quản lý khoa </h1>
            {/* Info */}
            <div className="mx-auto max-w-[650px] rounded-[10px] p-7">
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
                    <span className="mr-2 font-semibold">Mã khoa:</span> CNTT
                  </div>
                </li>
                <li className="mt-5 flex items-center gap-3">
                  <DriveFileRenameOutlineIcon sx={{ color: '#757575' }} />
                  <div>
                    <span className="mr-2 font-semibold">Tên khoa:</span> Công Nghệ Thông Tin
                  </div>
                </li>
                <li className="mt-5 flex items-center gap-3">
                  <AssignmentIndIcon sx={{ color: '#757575' }} />
                  <div>
                    <span className="mr-2 font-semibold">Tên trưởng khoa:</span> TS.Nguyễn Ánh Bích
                  </div>
                </li>
                <li className="mt-5 flex items-center gap-3">
                  <AccessTimeIcon sx={{ color: '#757575' }} />
                  <div>
                    <span className="mr-2 font-semibold">Năm thành lập:</span> 2000
                  </div>
                </li>
                <li className="mt-4 flex items-center  gap-3 ">
                  <CameraOutdoorIcon sx={{ color: '#757575' }} />
                  <div>
                    <span className="mr-2 font-semibold">Địa chỉ:</span> Mễ Trì,Nam Từ Liêm,Hà Nội
                  </div>
                </li>
                <li className="mt-4 flex items-center  gap-3 ">
                  <DescriptionIcon sx={{ color: '#757575' }} />
                  <div>
                    <span className="mr-2 font-semibold">Mô tả:</span>Khoa Công nghệ Thông tin (CNTT) là một đơn vị trong các trường đại học, cao đẳng chuyên
                    đào tạo.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </BackDrop>
      )}
      {/* FormAdd*/}
      {backdropType === BackdropType.AddModal && (
        <BackDrop isCenter={true}>
          <AddDepartment />
        </BackDrop>
      )}
      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};

export default Department;
