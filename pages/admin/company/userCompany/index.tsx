import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
// import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, Tooltip, Pagination, Checkbox, TextField } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Button, Button as MyButton } from '@/components/Common/Button';
// import Input from '@/components/Common/Input';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { useGetAllCompanyEmployeQuery } from '@/services/adminCompanyApi';
import { debounce } from 'lodash';
import { setToast } from '@/store/slices/toastSlice';



const validationSchema = Yup.object({
  search_employee: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});


const userCompany = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  // const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<number[]>([]);

  
  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);

  const {data: employee, isLoading} = useGetAllCompanyEmployeQuery({
    page,
    size: 10,
    keyword,
    status,
  })
  console.log(employee);
  

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployee(prev => (prev.includes(id) ? prev.filter(employeeId => employeeId !== id) : [...prev, id]));
  };


  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };


  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản nhân viên</h1>
        <div className="flex items-center gap-3 justify-between ">
          <div className="w-[220px]">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />

          </div>
          <div className='flex items-center gap-5'>
            <Link href={'/admin/company/userCompany/AddEmployee'}>
            <MyButton type="submit" text="Thêm nhân viên" />
            </Link>
            
            <MyButton type="submit" text="Xóa tất cả nhân viên" className='bg-red-600' />
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
                  checked={selectedEmployee.length === employee?.data.content.length}
                  indeterminate={selectedEmployee.length > 0 && selectedEmployee.length < (employee?.data.content||[]).length}
                  
                />
              </th>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Mã nhân viên</th>
              <th className="px-5 py-4 text-left">Tên nhân viên</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Ngày đăng ký</th>
              <th className="px-5 py-4 text-left">Vai trò</th>
              <th className="px-5 py-4 text-left">Số điện thoại</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employee?.data.content.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <Checkbox color="primary" checked={selectedEmployee.includes(item.id)} onChange={() => handleSelectEmployee(item.id)} />
                </td>
                <td className="px-5 py-4">{index + 1}</td> {/* STT */}
                <td className="px-5 py-4">{item.employeeCode}</td>
                <td className="px-5 py-4">{item.fullName}</td>
                <td className="px-5 py-4">{item.account.email}</td>
                <td className="px-5 py-4">{item.dateOfBirth}</td>
                <td className="px-5 py-4">{item.employeePosition}</td>
                <td className="px-5 py-4">{item.phoneNumber}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.employeeStatus}
                    sx={{
                      backgroundColor: item.employeeStatus === 'Đang làm' ? '#EBF9F1' : '#FEE5E5',
                      color: item.employeeStatus === 'Đang làm' ? '#1F9254' : '#CD0000',
                    }}
                  />
                </td>
                <td className="flex gap-2 px-5 py-4">
                  <Link href={'/admin/company/userCompany/detailUserCompany'}>
                  <Tooltip title="Xem chi tiết" onClick={() => dispatch(setId(item.id))}>
                    <IconButton>
                      <VisibilityIcon color="success" />
                    </IconButton>
                  </Tooltip>
                  </Link>

                  <Link href={'/admin/company/userCompany/UpdateEmployee'}>
                  <Tooltip title="Sửa">
                    <IconButton>
                      <BorderColorIcon className='text-purple-500' />
                    </IconButton>
                  </Tooltip>
                  </Link>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop for Employee Detail */}
       

      {/* Delete Confirmation */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sinh viên khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-600" full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};

export default userCompany;