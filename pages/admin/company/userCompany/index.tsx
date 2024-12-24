import React, { useEffect, useMemo, useState } from 'react';
import { Chip, IconButton, Tooltip, Pagination, Checkbox, TextField } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Button, Button as MyButton } from '@/components/Common/Button';

import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteAllEmployeeCompanyMutation, useDeleteEmployeeCompanyMutation, useGetAllCompanyEmployeQuery } from '@/services/adminCompanyApi';
import { debounce } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import { setKeyword, setPage } from '@/store/slices/filtersSlice';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';


const userCompany = () => {
  const [idEmployee, setIdEmployee] = useState <number>()
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [selectedEmployee, setSelectedEmployee] = useState<number[]>([]);

  console.log(idEmployee);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const {data: employee, isLoading} = useGetAllCompanyEmployeQuery({ page, keyword, size, status},{ refetchOnMountOrArgChange: true })
  console.log(employee);
  
  const [deleteC,{isLoading: isLoadingOne}] = useDeleteEmployeeCompanyMutation()
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteAllEmployeeCompanyMutation()

  const handleDelete = async () => {
    try {
      if (selectedEmployee.length > 0) {
        const response = await deleteMultiple({ ids: selectedEmployee }).unwrap();
        toast.success(response.message);
      } else {
        const response = await deleteC({ id: idEmployee }).unwrap();
        toast.success(response.message);
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    } finally {
      dispatch(setBackdrop(null));
    }
  };
  console.log(selectedEmployee)

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allEmployee = employee?.data.content.map(job => job.id);
      setSelectedEmployee(allEmployee ?? []);
    } else {
      setSelectedEmployee([]);
    }
  };

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployee(prev => (prev.includes(id) ? prev.filter(employeeId => employeeId !== id) : [...prev, id]));
  };

  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingOne || isLoadingMultiple));
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingOne]);

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
            <MyButton type="submit" icon={<AddIcon />} text="Thêm mới" />
            </Link>
            
            <MyButton 
              type="submit" 
              text="Xóa tất cả " 
              className='bg-red-600' 
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
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
                  checked={selectedEmployee.length === employee?.data.content.length}
                  indeterminate={selectedEmployee.length > 0 && selectedEmployee.length < (employee?.data.content||[]).length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Mã nhân viên</th>
              <th className="px-5 py-4 text-left">Tên nhân viên</th>
              <th className="px-5 py-4 text-left">Email</th>
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
                {/* <td className="flex gap-2 px-5 py-4">
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
                    <IconButton onClick={() => {
                      dispatch(setBackdrop(BackdropType.DeleteConfirmation))
                      dispatch(setName(item.fullName))
                      setIdEmployee(item.id)
                    } }>                  
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </td> */}
                <td className=" py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/company/userCompany/${item.id}`} onClick={() => dispatch(setId(item.id))} />

                      <ButtonUpdate href={`/admin/company/userCompany/update/${item.id}`} onClick={() => dispatch(setId(item.id))} />

                      <ButtonDelete
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setId(item.id));
                          dispatch(setName(item.fullName));
                        }}
                      />
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       

      {/* Delete Confirmation */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa {name}?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sinh viên khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-600"  onClick={ handleDelete} full={true}/>
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={employee?.data.totalPages} page={page} onChange={(value, event) => dispatch(setPage(event))}  color="primary" shape="rounded" />
      </div>
    </>
  );
};

export default userCompany;