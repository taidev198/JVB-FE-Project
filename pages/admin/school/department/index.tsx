import { Checkbox, TextField } from '@mui/material';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import PaginationComponent from '@/components/Common/Pagination';
import { useDeleteDepartmentMultipleMutation, useDeleteDepartmentOneMutation, useGetAllDepartmentsQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';

const Department = () => {
  const dispatch = useAppDispatch();
  const { page, keyword, size } = useAppSelector(state => state.filter);
  const name = useAppSelector(state => state.global.name);
  const [, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedDepartment, setSelectedDepartment] = useState<number[]>([]);
  const { data: departments, isLoading } = useGetAllDepartmentsQuery(
    {
      page: page,
      size: size,
      keyword,
    },
    { refetchOnMountOrArgChange: true }
  );

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

  const idDepartment = useAppSelector(state => state.global.id);
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteDepartmentOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteDepartmentMultipleMutation();
  const handleConfirmAction = async () => {
    try {
      if (selectedDepartment.length > 0) {
        await deleteMultiple({ ids: selectedDepartment }).unwrap();
        toast.success('Các khoa đã được xóa thành công.');
      } else {
        await deleteOne({ id: idDepartment }).unwrap();
        toast.success('Khoa đã được xóa thành công.');
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
      const allAdemicIds = departments?.data.content.map(department => department.id);
      setSelectedDepartment(allAdemicIds ?? []);
    } else {
      setSelectedDepartment([]);
    }
  };
  const handleSelectDepartment = (id: number) => {
    setSelectedDepartment(prev => (prev.includes(id) ? prev.filter(departmentId => departmentId !== id) : [...prev, id]));
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
        <h1 className="mb-5 font-bold">Danh sách quản lý khoa</h1>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã khoa"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
          </div>
          <div className="ml-auto flex justify-items-center gap-5">
            <Link
              href={'/admin/school/department/AddDepartment'}
              className="rounded-[8px] border-[1px] bg-[#34a853] px-6 py-2 text-white transition duration-300 hover:bg-[#2e7b42]">
              <AddIcon className="mr-1 h-6 w-6 items-center text-white" />
              Thêm mới
            </Link>
            <MyButton
              type="submit"
              text="Xóa khoa"
              onClick={() => {
                dispatch(setName('đã chọn'));
                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
              }}
              className="bg-red-custom"
              disabled={!selectedDepartment.length}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white px-24 text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedDepartment.length > 0 && departments?.data.content.length > 0}
                  indeterminate={selectedDepartment.length > 0 && selectedDepartment.length < (departments?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              <th
                className="p-3 text-left
              sm:px-5 sm:py-4">
                <span className="min-w-max py-[6px]">STT</span>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max">Mã khoa</span>
                  <span className="">
                    <ButtonUp />
                    <ButtonArrow />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max">Tên khoa</span>
                  <span className="">
                    <ButtonUp />
                    <ButtonArrow />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max">Trưởng khoa</span>
                  <span className="">
                    <ButtonUp />
                    <ButtonArrow isSort />
                  </span>
                </div>
              </th>
              <th className="p-3 text-left sm:px-5">
                <span className="min-w-max">Năm thành lập</span>
              </th>
              <th className="p-3 text-left sm:px-5">
                <span className="min-w-max">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {departments?.data?.content && departments.data.content.length > 0 ? (
              departments.data.content.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 text-center sm:px-3 sm:py-4">
                    <Checkbox color="primary" checked={selectedDepartment.includes(item.id)} onChange={() => handleSelectDepartment(item.id)} size="small" />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <span className="min-w-max">{index + 1 + (page - 1) * size}</span>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <span className="min-w-max">{item.facultyCode}</span>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <span className="min-w-max">{item.facultyName}</span>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4 ">
                    <span className="min-w-max">{item.nameDean}</span>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <span className="min-w-max ">{item.establishYear}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/school/department/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonUpdate href={`/admin/school/department/updateDepartment/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonDelete
                        onClick={() => {
                          handleOpenConfirm(item.id);
                          dispatch(setName(item.facultyName));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-black">
                  <span>Không có dữ liệu nào</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showBackdrop === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa khoa {name} này không?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn khoa khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}

      <PaginationComponent
        count={departments?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={departments?.data.totalElements}
      />
    </>
  );
};

export default Department;
