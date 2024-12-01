import { Chip, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, TextField, Tooltip } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

const AdminSystemSubAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('');

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản quản trị viên</h1>
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
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên tài khoản</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Vai trò</th>
              <th className="px-5 py-4 text-left">Trạng Thái</th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#F7F6FE]">
              <td className="px-5 py-4">1</td>
              <td className="px-5 py-4"> Nguyễn Văn Admin</td>
              <td className="px-5 py-4">nguyenvanaadmin@gmail.com</td>
              <td className="px-5 py-4">Supper Admin</td>
              <td className="px-5 py-4 text-red-500">
                <Chip label="Hoạt động" sx={{ backgroundColor: '#EBF9F1', color: '#1F9254' }} />
              </td>
              <td className="flex gap-2 px-5 py-4">
                <Link href={'/admin/system/sub-admin/detail'}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton>
                      <VisibilityIcon color="success" />
                    </IconButton>
                  </Tooltip>
                </Link>
              </td>
            </tr>
            <tr className="bg-[#F7F6FE]">
              <td className="px-5 py-4">2</td>
              <td className="px-5 py-4">Lê Thị Content</td>
              <td className="px-5 py-4">lethicontent@gmail.com</td>
              <td className="px-5 py-4">Content Manager</td>
              <td className="px-5 py-4 text-red-500">
                <Chip label="Tạm ngừng" color="warning" />
              </td>
              <td className="gap-2 px-5 py-4">
                <Link href={'/admin/system/sub-admin/detail'}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton>
                      <VisibilityIcon color="success" />
                    </IconButton>
                  </Tooltip>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};
export default AdminSystemSubAdmin;
