import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip, Pagination, TextField } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading } from '@/store/slices/global';
import AddIcon from '@mui/icons-material/Add';
import { setToast } from '@/store/slices/toastSlice';
import { debounce } from 'lodash';
import { useDeleteBusinessMutation, useGetAllBusinessQuery } from '@/services/adminSchoolApi';

const BusinessManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState('');

  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);

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
  const [deleteBusiness, { isLoading: isLoadingDelete, isSuccess, data }] = useDeleteBusinessMutation();
  const handleConfirmAction = () => {
    deleteBusiness({ id: selectId });
  };
  const { data: business, isLoading } = useGetAllBusinessQuery({
    page: currentPage,
    size: 10,
    keyword,
  });
  console.log(business);

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
        <h1 className="mb-5 font-bold">Danh sách quản ngành học</h1>
        <div className="flex items-center justify-between gap-3 ">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
          <Link href={'/admin/school/businessManagement/AddBusiness'}>
            <MyButton type="submit" text="Thêm mới" icon={<AddIcon />} />
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã Ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Tên Ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số Tín Chỉ</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số Sinh Viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Khoa</p>
              </th>

              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Thao Tác</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {business?.data.content.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.majorCode}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.majorName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.creditRequirement}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.numberOfStudents}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.faculty.facultyName}</p>
                </td>

                <td className="gap-2 px-2 py-4 sm:px-5 ">
                  <div className="flex items-center">
                    <p className="min-w-max">
                      <Link href={`/admin/school/businessManagement/${item.id}`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton onClick={() => dispatch(setId(item.id))}>
                            <VisibilityIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Sửa Ngành Học">
                        <Link href={`/admin/school/businessManagement/update/${item.id}`} onClick={() => dispatch(setId(item.id))}>
                          <IconButton>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Link>
                      </Tooltip>

                      <Tooltip title="Xóa Ngành Học">
                        <IconButton onClick={() => handleOpenConfirm(item.id)}>
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

      {showBackdrop === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn ngành học khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
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

export default BusinessManagement;
