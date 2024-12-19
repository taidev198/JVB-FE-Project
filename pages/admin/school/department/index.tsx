import { IconButton, Tooltip, Pagination, TextField, Checkbox } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useDeleteDepartmentMultipleMutation, useDeleteDepartmentOneMutation, useGetAllDepartmentsQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import toast from 'react-hot-toast';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';

const Department = () => {
  const dispatch = useAppDispatch();
  const { page, keyword, size, status, universityType } = useAppSelector(state => state.filter);
  const name = useAppSelector(state => state.global.name);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedDepartment, setSelectedDepartment] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [department, setDepartment] = useState<number | null>(null);

  const { data: departments, isLoading } = useGetAllDepartmentsQuery({
    page,
    size,
    keyword,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
  };

  const idDepartment = useAppSelector(state => state.global.id);
  console.log(departments);
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteDepartmentOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteDepartmentMultipleMutation();
  const handleConfirmAction = async () => {
    try {
      if (selectedDepartment.length > 0) {
        const response = await deleteMultiple({ ids: selectedDepartment }).unwrap();
        toast.success(response.message);
      } else {
        const response = await deleteOne({ id: idDepartment }).unwrap();
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
  console.log(selectedDepartment);
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
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý khoa</h1>
        <div className="flex items-center justify-between gap-3 ">
          <div className="flex gap-10">
            <TextField
              id="filled-search"
              label="Tìm kiếm"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full"
            />
            <Select
              placeholder="Chọn khoa"
              closeMenuOnSelect={true}
              options={[
                { value: null, label: 'Tất cả' },
                ...(departments?.data.content || []).map(department => ({
                  value: department.id,
                  label: department.facultyName,
                })),
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string | null> }) => {
                setDepartment(selectedOption.value ? Number(selectedOption.value) : null);
              }}
              className="w-full cursor-pointer "
            />
          </div>
          <div className="flex items-center gap-5">
            <Link href={'/admin/school/department/AddDepartment'}>
              <MyButton type="submit" text="Thêm mới" icon={<AddIcon />} />
            </Link>
            <MyButton
              type="submit"
              text="Xóa khoa đã chọn"
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
              className="bg-red-custom"
              disabled={!selectedDepartment.length}
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
                  checked={selectedDepartment.length === departments?.data.content.length}
                  indeterminate={selectedDepartment.length > 0 && selectedDepartment.length < (departments?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
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
                    <Checkbox color="primary" checked={selectedDepartment.includes(item.id)} onChange={() => handleSelectDepartment(item.id)} size="small" />
                  </td>
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
                              dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                              dispatch(setId(item.id));
                              dispatch(setName(item.facultyName));
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
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa khoa {name} này không?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn khoa khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={departments?.data.totalPages} page={page} onChange={(event, value) => dispatch(setPage(value))} color="primary" shape="rounded" />
        <p className="text-sm">
          ({departments?.data.currentPage} / {departments?.data.totalPages})
        </p>
      </div>
    </>
  );
};

export default Department;
