import React, { useState } from 'react';
import { Chip, IconButton, Tooltip, Pagination, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Link from 'next/link';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useDispatch } from 'react-redux';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';

// Kiểu trạng thái tài khoản
type StatusAccount = 'ACCEPT' | 'BAN' | 'PEDING';

// Dữ liệu giả lập
const mockData = [
  { id: 1, universityName: 'Đại học Bách Khoa Hà Nội', universityType: 'Đại học', numberOfStudents: 11150, statusAccount: 'PEDING' },
  { id: 2, universityName: 'Học viện Phụ Nữ', universityType: 'Học viện', numberOfStudents: 3500, statusAccount: 'ACCEPT' },
  { id: 3, universityName: 'Cao đẳng Bách Khoa', universityType: 'Cao đẳng', numberOfStudents: 5000, statusAccount: 'BAN' },
];

const AdminSystemSchool = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<StatusAccount | 'all'>('all');
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleAction = (actionType: BackdropType, companyId: number) => {
    setSelectedSchoolId(companyId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
  };

  const handleConfirmAction = async () => {
    if (selectedSchoolId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.ApproveConfirmation:
            break;
          case BackdropType.RefuseConfirmation:
            break;
          case BackdropType.LockConfirmation:
            break;
          case BackdropType.UnlockConfirmation:
            break;
          default:
            throw new Error('Invalid action type');
        }
        // TODO: Update local data or refetch list if needed
      } catch (error) {
        console.error('Error performing action:', error);
      } finally {
        dispatch(setBackdrop(null));
        setSelectedSchoolId(null);
        setSelectedAction(null);
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản doanh nghiệp</h1>
        <div className="flex items-center gap-3">
          <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
            <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={status}
              label="Chọn"
              onChange={e => setStatus(e.target.value as StatusAccount)}>
              <MenuItem value="all">
                <em>Tất cả</em>
              </MenuItem>
              <MenuItem value={'ACCEPT'}>Hoạt động</MenuItem>
              <MenuItem value={'BAN'}>Tạm ngừng</MenuItem>
            </Select>
          </FormControl>
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên trường</th>
              <th className="px-5 py-4 text-left">Loại hình</th>
              <th className="px-5 py-4 text-left">Số sinh viên</th>
              <th className="px-5 py-4 text-left">Trạng Thái</th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="px-5 py-4">{item.id}</td>
                <td className="px-5 py-4">
                  <Link href={'/admin/system/school/detail'} className="hover:text-primary-main">
                    {item.universityName}
                  </Link>
                </td>
                <td className="px-5 py-4">{item.universityType}</td>
                <td className="px-5 py-4">{item.numberOfStudents}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.statusAccount}
                    sx={{
                      backgroundColor: item.statusAccount === 'ACCEPT' ? '#EBF9F1' : item.statusAccount === 'BAN' ? '#FFE5E5' : '#FFF4E5',
                      color: item.statusAccount === 'ACCEPT' ? '#1F9254' : item.statusAccount === 'BAN' ? '#FF5252' : '#FFA726',
                    }}
                  />
                </td>
                <td className="flex items-center py-4">
                  <Tooltip title="Duyệt tài khoản">
                    <IconButton onClick={() => handleAction(BackdropType.ApproveConfirmation, item.id)}>
                      <CheckBoxIcon color="success" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Từ chối">
                    <IconButton onClick={() => handleAction(BackdropType.RefuseConfirmation, item.id)}>
                      <ClearIcon color="warning" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Khóa tài khoản">
                    <IconButton onClick={() => handleAction(BackdropType.LockConfirmation, item.id)}>
                      <LockIcon color="error" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Mở khóa tài khoản">
                    <IconButton onClick={() => handleAction(BackdropType.UnlockConfirmation, item.id)}>
                      <LockOpenIcon color="success" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>

      {/* Backdrops */}
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && 'Duyệt tài khoản trường học'}
              {selectedAction === BackdropType.RefuseConfirmation && 'Từ chối tài khoản trường học'}
              {selectedAction === BackdropType.LockConfirmation && 'Khóa tài khoản trường học'}
              {selectedAction === BackdropType.UnlockConfirmation && 'Mở khóa tài khoản trường học'}
            </h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}
    </>
  );
};

export default AdminSystemSchool;
