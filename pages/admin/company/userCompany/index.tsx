import { useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';
import { Checkbox, Chip, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Button as MyButton } from '@/components/Common/Button';

import { BackDrop } from '@/components/Common/BackDrop';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import { useDeleteAllEmployeeCompanyMutation, useDeleteEmployeeCompanyMutation, useGetAllCompanyEmployeQuery } from '@/services/adminCompanyApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import PaginationComponent from '@/components/Common/Pagination';
import { statusEmployee } from '@/utils/app/const';

const UserCompany = () => {
  const [idEmployee, setIdEmployee] = useState<number>();
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [selectedEmployee, setSelectedEmployee] = useState<number[]>([]);
  const [startDate] = useState<Date | null>(null);
  const [endDate] = useState<Date | null>(null);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: employee, isLoading } = useGetAllCompanyEmployeQuery(
    {
      status: status,
      page: page,
      size: size,
      keyword,
      startDate: startDate,
      endDate: endDate,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteOne, { isLoading: isLoadingOne }] = useDeleteEmployeeCompanyMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteAllEmployeeCompanyMutation();

  const handleDelete = async () => {
    try {
      if (selectedEmployee.length > 0) {
        await deleteMultiple({ ids: selectedEmployee }).unwrap();
        toast.success('Các nhân viên đã được xóa thành công');
      } else {
        await deleteOne({ id: idEmployee }).unwrap();
        toast.success('Nhân viên đã được xóa thành công');
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
    return () => {
      dispatch(resetFilters());
    };
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingOne]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách tài khoản nhân viên</h1>
        <div className="flex items-center justify-between gap-3 ">
          <div className="w-[220px]">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên nhân viên"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5">
            <Link
              href={'/admin/company/userCompany/AddEmployee'}
              className="flex items-center justify-center rounded-[8px] border-[1px] bg-[#34a853] px-6 py-2
               text-white transition duration-300 ease-in-out hover:bg-[#2e7b42] ">
              <AddIcon />
              Thêm mới
            </Link>
            <MyButton
              type="submit"
              text="Xóa nhân viên "
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
              className="bg-red-custom"
              disabled={!selectedEmployee.length}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedEmployee.length > 0 && employee?.data.content.length > 0}
                  indeterminate={selectedEmployee.length > 0 && selectedEmployee.length < (employee?.data.content || []).length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 py-4 text-left sm:px-3">STT</th>
              <th className="px-5 py-4 text-left">Mã nhân viên</th>
              <th className="px-5 py-4 text-left">Tên nhân viên</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Chức vụ</th>
              <th className="px-5 py-4 text-left">Số điện thoại</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employee?.data?.content && employee.data.content.length > 0 ? (
              employee?.data.content.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                  <td className="p-3 text-center sm:px-3 sm:py-4">
                    <Checkbox color="primary" checked={selectedEmployee.includes(item.id)} onChange={() => handleSelectEmployee(item.id)} />
                  </td>
                  <td className="px-5 py-4">{index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{item.employeeCode}</td>
                  <td className="px-5 py-4">{item.fullName}</td>
                  <td className="px-5 py-4">{item.account.email}</td>
                  <td className="px-5 py-4">{item.employeePosition}</td>
                  <td className="px-5 py-4">{item.phoneNumber}</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={statusEmployee(item.employeeStatus).title}
                      sx={{
                        backgroundColor: statusEmployee(item.employeeStatus).bg,
                        color: statusEmployee(item.employeeStatus).color,
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/company/userCompany/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonUpdate href={`/admin/company/userCompany/update/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonDelete
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          setIdEmployee(item.id);
                          dispatch(setName(item.fullName));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-black">
                  <p>Không có dữ liệu nào</p>
                </td>
              </tr>
            )}
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
              <Button text="Xác nhận" className="bg-red-600" onClick={handleDelete} full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <PaginationComponent
        count={employee?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={employee?.data.totalElements}
      />
    </>
  );
};

export default UserCompany;
