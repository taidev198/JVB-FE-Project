import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, TextField } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useDeleteAdemicMultipleMutation, useDeleteAdemicOneMutation, useGetAllAcademicOfficeManagementQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';
import { genderTitle } from '@/utils/app/const';

const AcademicOfficeManagement = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [selectedAdemic, setSelectedAdemic] = useState<number[]>([]);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size } = useAppSelector(state => state.filter);
  const [selectId, setSelectId] = useState<number | null>(null);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );
  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteAdemicOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteAdemicMultipleMutation();
  const handleDelete = async () => {
    try {
      if (selectedAdemic.length > 0) {
        await deleteMultiple({ ids: selectedAdemic }).unwrap();
        toast.success('Các giáo vụ đã được xóa thành công');
      } else {
        await deleteOne({ id: selectId }).unwrap();
        toast.success('Giáo vụ đã được xóa thành công');
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

  const { data: academicOfficeManagement, isLoading } = useGetAllAcademicOfficeManagementQuery(
    {
      page: page,
      size: size,
      keyword,
    },
    { refetchOnMountOrArgChange: true }
  );
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
    return () => {
      dispatch(resetFilters());
    };
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingDeleteOne]);
  return (
    <>
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản lý giáo vụ</h1>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã giáo vụ"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="ml-auto flex justify-items-center gap-5">
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
                  size="small"
                />
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">STT</p>
              </th>

              <th className="p-3 text-left sm:px-5 sm:py-4">Mã nhân viên</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Họ và tên</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Số điện thoại</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Giới tính</th>
              <th className="p-3 text-left sm:px-5 sm:py-4">Ngày sinh</th>

              <th className="p-3 text-left sm:px-5 sm:py-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {academicOfficeManagement?.data?.content && academicOfficeManagement.data.content.length > 0 ? (
              academicOfficeManagement?.data.content.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Checkbox color="primary" checked={selectedAdemic.includes(item.id)} onChange={() => handleSelectAdemic(item.id)} size="small" />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{index + 1 + (page - 1) * size}</p>
                  </td>

                  <td className="p-3 sm:px-5 sm:py-4">{item.employeeCode}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.fullName}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.phoneNumber}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{genderTitle(item.gender)}</td>
                  <td className="p-3 sm:px-5 sm:py-4">{item.dateOfBirth}</td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/school/academicOfficeManagement/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonUpdate href={`/admin/school/academicOfficeManagement/update/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonDelete
                        onClick={() => {
                          handleOpenConfirm(item.id);
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

      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa giáo vụ {name} này không?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn giáo vụ khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleDelete} />
            </div>
          </div>
        </BackDrop>
      )}

      <PaginationComponent
        count={academicOfficeManagement?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={academicOfficeManagement?.data.totalElements}
        totalTitle={'giáo vụ'}
      />
    </>
  );
};

export default AcademicOfficeManagement;
