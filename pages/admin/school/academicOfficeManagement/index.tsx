import React, { useState } from 'react';
import { Checkbox, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button as MyButton } from '@/components/Common/Button';
import AddAdemic from '@/components/Admin/school/Ademic/addAdemic';

const AcademicOfficeManagement = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdemic, setSelectedAdemic] = useState<number[]>([]);

  // Data giả lập
  const mockData = [
    {
      id: 1,
      employee_code: 'STU029',
      full_name: 'Trần Minh Anh',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi/image/upload/v1731915716/default0',
      email: 'student29@gmail.com',
      gender: 'Nam',
      phone_number: '0903456789',
      data_of_birth: '2001-07-25',
    },
    {
      id: 2,
      employee_code: 'ph44673',
      full_name: 'Nguyễn Minh Anh',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi/image/upload/v1731915716/default0',
      email: 'nguyenminhanh@gmail.com',
      gender: 'Nữ',
      phone_number: '0903456789',
      data_of_birth: '2001-07-25',
    },
    {
      id: 3,
      employee_code: 'PS74822',
      full_name: 'Phạm Văn A',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi/image/upload/v1731915716/default0',
      email: 'phamvana@gmail.com',
      gender: 'Nam',
      phone_number: '0878376527',
      data_of_birth: '2001-07-25',
    },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allAdemicIds = mockData.map(ademic => ademic.id);
      setSelectedAdemic(allAdemicIds);
    } else {
      setSelectedAdemic([]);
    }
  };

  const handleSelectAdemic = (id: number) => {
    setSelectedAdemic(prev => (prev.includes(id) ? prev.filter(ademicId => ademicId !== id) : [...prev, id]));
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý giáo vụ</h1>
        <div className="flex items-center justify-between gap-3">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" />
          <div className="flex gap-5">
            <MyButton type="submit" text="Thêm mới" onClick={() => dispatch(setBackdrop(BackdropType.AddModal))} />
            <MyButton
              type="submit"
              text="Xóa tất cả giáo vụ đã chọn"
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
              className="bg-red-custom"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedAdemic.length === mockData.length}
                  indeterminate={selectedAdemic.length > 0 && selectedAdemic.length < mockData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">STT</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Ảnh đại diện</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Mã Nhân Viên</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Họ Và Tên</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Số Điện Thoại</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Giới Tính</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Ngày Sinh</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Gmail </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => {
              const emailParts = item.email.split('@'); // Tách địa chỉ email
              const hiddenEmail = '*'.repeat(emailParts[0].length) + '@' + emailParts[1]; // Ẩn tên người dùng
              return (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Checkbox color="primary" checked={selectedAdemic.includes(item.id)} onChange={() => handleSelectAdemic(item.id)} />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">{index + 1}</td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Image src={item?.avatarUrl} alt="ảnh" width={50} height={50} />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.employee_code}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.full_name}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.phone_number}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.gender}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.data_of_birth}</td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Tooltip title={item.email}>
                      <span className="cursor-pointer">{hiddenEmail}</span>
                    </Tooltip>
                  </td>
                  <td className="gap-2 px-2 py-4 sm:px-5">
                    <div className="flex items-center">
                      <Link href={`/admin/school/academicOfficeManagement/detailacAdemicOfficeManagement?id=${item.id}`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton>
                            <VisibilityIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link href={`/admin/school/academicOfficeManagement/update`}>
                        <Tooltip title="Sửa khoa">
                          <IconButton>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Tooltip title="Xóa giáo vụ">
                        <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Xóa Sinh viên */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn giáo vụ khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <MyButton text="Hủy" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <MyButton text="Xác nhận" className="bg-red-800" full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Form Add */}
      {backdropType === BackdropType.AddModal && (
        <BackDrop isCenter={true}>
          <AddAdemic />
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};

export default AcademicOfficeManagement;
