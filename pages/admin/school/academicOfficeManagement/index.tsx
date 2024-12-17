import React, { useEffect, useState } from 'react';
import { Checkbox, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import AddAdemic from '@/pages/admin/school/academicOfficeManagement/addAdemic';
import { setToast } from '@/store/slices/toastSlice';
import { useDeleteAdemicMultipleMutation, useDeleteAdemicOneMutation, useGetAllAcademicOfficeManagementQuery } from '@/services/adminSchoolApi';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

const AcademicOfficeManagement = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdemic, setSelectedAdemic] = useState<number[]>([]);
  // const [deleteAcademicOfficeManagement, { isLoading: isLoadingDelete, data }] = useDeleteAcademicOfficeManagementMutation();

  const idAdemic = useAppSelector(state => state.global.id);
  const name = useAppSelector(state => state.global.name);
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

  // const handleConfirmAction = () => {
  //   deleteAcademicOfficeManagement({ id: selectId });
  // };
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteAdemicOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteAdemicMultipleMutation();
  const handleDelete = async () => {
    try {
      if (selectedAdemic.length > 0) {
        const response = await deleteMultiple({ ids: selectedAdemic }).unwrap();
        toast.success(response.message);
      } else {
        const response = await deleteOne({ id: idAdemic }).unwrap();
        toast.success(response.message);
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string }).message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    } finally {
      dispatch(setBackdrop(null));
    }
  };
  console.log(selectedAdemic);

  const {
    data: academicOfficeManagement,
    isLoading,
    isSuccess,
  } = useGetAllAcademicOfficeManagementQuery({
    page: currentPage,
    size: 10,
    keyword,
  });
  console.log(academicOfficeManagement);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allAdemicIds = academicOfficeManagement?.data.content.map(ademic => ademic.id);
      setSelectedAdemic(allAdemicIds ?? []);
    } else {
      setSelectedAdemic([]);
    }
  };
  const handleSelectAdemic = (id: number) => {
    setSelectedAdemic(prev => (prev.includes(id) ? prev.filter(ademicId => ademicId !== id) : [...prev, id]));
  };
  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingDeleteOne || isLoadingMultiple));
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingDeleteOne]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý giáo vụ</h1>
        <div className="flex items-center justify-between gap-3">
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
          <div className="flex gap-5">
            <Link href={'/admin/school/academicOfficeManagement/addAdemic'}>
              <MyButton type="submit" text="Thêm mới" icon={<AddIcon />} />
            </Link>
            <MyButton
              type="submit"
              text="Xóa tất cả đã chọn"
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
                  checked={selectedAdemic.length === academicOfficeManagement?.data.content.length}
                  indeterminate={selectedAdemic.length > 0 && selectedAdemic.length < (academicOfficeManagement?.data.content || []).length}
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
            {academicOfficeManagement?.data.content.map((item, index) => {
              return (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Checkbox color="primary" checked={selectedAdemic.includes(item.id)} onChange={() => handleSelectAdemic(item.id)} />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">{index + 1}</td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Image src={item?.avatarUrl} alt="ảnh" width={50} height={50} />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.employeeCode}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.fullName}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.phoneNumber}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.gender}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.dateOfBirth}</td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Tooltip title={item?.account?.email}>
                      <span className="cursor-pointer">{item?.account?.email}</span>
                    </Tooltip>
                  </td>
                  <td className="gap-2 px-2 py-4 sm:px-5">
                    <div className="flex items-center">
                      <Link href={`/admin/school/academicOfficeManagement/${item.id}`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton onClick={() => dispatch(setId(item.id))}>
                            <VisibilityIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link href={`/admin/school/academicOfficeManagement/update/${item.id}`}>
                        <Tooltip title="Sửa giáo vụ">
                          <IconButton onClick={() => dispatch(setId(item.id))}>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Tooltip title="Xóa giáo vụ">
                        <IconButton
                          onClick={() => {
                            dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                            dispatch(setId(item.id));
                            dispatch(setName(item.fullName));
                          }}>
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
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa {name}?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn giáo vụ khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleDelete} />
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
