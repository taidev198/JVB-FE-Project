import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useMemo, useState } from 'react';
import { IconButton, Tooltip, Pagination, TextField, Checkbox } from '@mui/material';
import Link from 'next/link';
import Select from 'react-select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';
import {
  useDeleteBusinessMultipleMutation,
  useDeleteBusinessOneMutation,
  useGetAllBusinessQuery,
  useGetAllDepartmentsPortalQuery,
  useGetAllFaculityQuery,
  useGetAllMajorsQuery,
} from '@/services/adminSchoolApi';
import toast from 'react-hot-toast';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { setKeyword, setPage, setIdFaculty } from '@/store/slices/filtersSlice';

const BusinessManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useAppDispatch();
  const { data: dataMajor } = useGetAllMajorsQuery();
  const { page, keyword, size, idFaculty } = useAppSelector(state => state.filter);
  const name = useAppSelector(state => state.global.name);
  const [major, setMajor] = useState<number | null>(null);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedBusiness, setSelectedBusiness] = useState<number[]>([]);
  const { data: dataDepartments, isLoading: isLoadingGetAllDepartment } = useGetAllFaculityQuery();
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
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };

  const { data: business, isLoading } = useGetAllBusinessQuery(
    {
      page,
      size,
      keyword,
      idFaculty: idFaculty,
    },
    { refetchOnMountOrArgChange: true }
  );

  const idBusiness = useAppSelector(state => state.global.id);
  console.log(business);
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteBusinessOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteBusinessMultipleMutation();
  const handleConfirmAction = async () => {
    try {
      if (selectedBusiness.length > 0) {
        const response = await deleteMultiple({ ids: selectedBusiness }).unwrap();
        toast.success(response.message);
      } else {
        const response = await deleteOne({ id: idBusiness }).unwrap();
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
  console.log(selectedBusiness);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allAdemicIds = business?.data.content.map(ademic => ademic.id);
      setSelectedBusiness(allAdemicIds ?? []);
    } else {
      setSelectedBusiness([]);
    }
  };
  const handleSelectBusiness = (id: number) => {
    setSelectedBusiness(prev => (prev.includes(id) ? prev.filter(ademicId => ademicId !== id) : [...prev, id]));
  };
  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingDeleteOne || isLoadingMultiple));
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingDeleteOne]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản ngành học</h1>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                ...(dataDepartments?.data || []).map(department => ({
                  value: department.id,
                  label: department.facultyName,
                })),
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string | null> }) => {
                dispatch(setIdFaculty(selectedOption.value ? Number(selectedOption.value) : null));
              }}
              className="w-full cursor-pointer "
            />
          </div>
          <div className="ml-auto flex justify-items-center gap-5">
            <Link href={'/admin/school/businessManagement/AddBusiness'}>
              <MyButton type="submit" text="Thêm mới" icon={<AddIcon />} />
            </Link>
            <MyButton
              type="submit"
              text="Xóa ngành đã chọn"
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
              className="bg-red-custom"
              disabled={!selectedBusiness.length}
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
                  checked={selectedBusiness.length === business?.data.content.length}
                  indeterminate={selectedBusiness.length > 0 && selectedBusiness.length < (business?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Tên ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số tín chỉ</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số sinh viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">khoa</p>
              </th>

              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Thao tác</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {business?.data?.content && business.data.content.length > 0 ? (
              business.data.content.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Checkbox color="primary" checked={selectedBusiness.includes(item.id)} onChange={() => handleSelectBusiness(item.id)} size="small" />
                  </td>
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

                  <td className="gap-2 px-2 py-4 sm:px-5">
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
                          <IconButton
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                              dispatch(setId(item.id));
                              dispatch(setName(item.majorName));
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

      {showBackdrop === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa ngành học {name} này kh?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn ngành học khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={business?.data.totalPages} page={page} onChange={(event, value) => dispatch(setPage(value))} color="primary" shape="rounded" />
        <p className="text-sm">
          ({business?.data.currentPage} / {business?.data.totalPages})
        </p>
      </div>
    </>
  );
};

export default BusinessManagement;
