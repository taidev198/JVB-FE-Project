import { Chip, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, TextField, Tooltip } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { Button } from '@/components/Common/Button';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { BackdropType, setBackdrop } from '@/store/slices/global';

const AdminSystemSchool = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('');

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản trường đại học</h1>
        <div className="flex items-center gap-3">
          <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
            <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
            <Select labelId="demo-select-small-label" id="demo-select-small" value={status} label="Chọn" onChange={e => setStatus(e.target.value)}>
              <MenuItem value="all">
                <em>Tất cả</em>
              </MenuItem>
              <MenuItem value={'active'}>Hoạt động</MenuItem>
              <MenuItem value={'disable'}>Tạm ngừng</MenuItem>
            </Select>
          </FormControl>
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto overflow-x-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">STT</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Tên trường</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Loại hình</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số sinh viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Trạng Thái</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Thao Tác</p>
              </th>
            </tr>
          </thead>
          <tbody className="">
            <tr className="bg-[#F7F6FE] ">
              <td className="p-3 sm:px-5 sm:py-4">
                <p className="min-w-min">1</p>
              </td>
              <td className="p-3 sm:px-5 sm:py-4">
                <p className="min-w-max">Đại học Quốc Gia Hà Nội</p>
              </td>
              <td className="p-3 sm:px-5 sm:py-4">
                <p className="min-w-max">Công lập</p>
              </td>
              <td className="p-3 sm:px-5 sm:py-4">
                <p className="min-w-max">3000</p>
              </td>
              <td className="p-3 sm:px-5 sm:py-4">
                <p className="min-w-max">
                  <Chip label="Hoạt động" sx={{ backgroundColor: '#EBF9F1', color: '#1F9254' }} />
                </p>
              </td>
              <td className="gap-2 px-2 py-4 sm:px-5 ">
                <div className="flex items-center">
                  <p className="min-w-max">
                    <Link href={'/admin/system/school/detail'}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton>
                          <VisibilityIcon color="success" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                    <Tooltip title="Khóa tài khoản">
                      <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                        <LockIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Khóa tài khoản Trường học</h3>
            <p className="mt-1">Bạn có chắc chắn muốn khóa tài khoản trường học đại học này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} />
            </div>
          </div>
        </BackDrop>
      )}
      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};
export default AdminSystemSchool;
