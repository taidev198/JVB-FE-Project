import { IconButton, Tooltip, Pagination, TextField } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading } from '@/store/slices/global';

import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useDeleteDepartmentMutation, useGetAllDepartmentsQuery } from '@/services/adminSchoolApi';
import { setToast } from '@/store/slices/toastSlice';

const Department = () => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');

  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [deleteDepartment, { isLoading: isLoadingDelete, isSuccess, data }] = useDeleteDepartmentMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: departments,
    isLoading,
    refetch,
  } = useGetAllDepartmentsQuery({
    page: currentPage,
    size: 10,
    keyword,
  });

  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };

  const handleConfirmAction = () => {
    deleteDepartment({ id: selectId });
    refetch(); // Gọi lại API sau khi xóa
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data?.message }));
      dispatch(setBackdrop(null));
    }
    dispatch(setLoading(isLoading || isLoadingDelete));
  }, [isLoading, dispatch, isLoadingDelete, data?.message, isSuccess]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý khoa</h1>
        <div className="flex items-center justify-between gap-3 ">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
          <Link href={'/admin/school/department/AddDepartment'}>
            <MyButton text="Thêm mới" icon={<AddIcon />} />
          </Link>
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
            {departments?.data?.content && departments.data.content.length > 0 ? (
              departments.data.content.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{item.facultyCode}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{item.facultyName}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{item.nameDean}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{item.establishYear}</p>
                  </td>
                  <td className="gap-2 px-2 py-4 sm:px-5">
                    <div className="flex items-center">
                      <p className="min-w-max">
                        <Link href={`/admin/school/department/${item.id}`}>
                          <Tooltip title="Xem chi tiết">
                            <IconButton onClick={() => dispatch(setId(item.id))}>
                              <VisibilityIcon color="success" />
                            </IconButton>
                          </Tooltip>
                        </Link>

                        <Tooltip title="Sửa khoa">
                          <Link href={`/admin/school/department/updateDepartment/${item.id}`} onClick={() => dispatch(setId(item.id))}>
                            <IconButton onClick={() => handleOpenConfirm(item.id)}>
                              <BorderColorIcon className="text-purple-500" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Xóa khoa">
                          <IconButton
                            onClick={() => {
                              handleOpenConfirm(item.id);
                              dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                            }}>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </Tooltip>
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-red-500">
                  <p>Không có dữ liệu nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Xóa Khoa */}
      {showBackdrop === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn khoa khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} onClick={handleConfirmAction} />
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

export default Department;
