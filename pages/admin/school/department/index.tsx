/* eslint-disable no-console */
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { Checkbox, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDeleteDepartmentMultipleMutation, useDeleteDepartmentOneMutation, useGetAllDepartmentsQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { Button as MyButton } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import YearPickerComponent from '@/components/Common/YearPicker';

const Department = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const name = useAppSelector(state => state.global.name);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedDepartment, setSelectedDepartment] = useState<number[]>([]);
  const { data: departments, isLoading } = useGetAllDepartmentsQuery(
    {
      page: page,
      size: size,
      keyword,
      startDate: startDate,
      endDate: endDate,
      sortBy: sortBy || 'facultyCode:asc',
    },
    { refetchOnMountOrArgChange: true }
  );

  const [sortState, setSortState] = React.useState({
    activeColumn: null,
    isAsc: null,
  });

  const handleSort = (column: String, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy);
    setSortState({
      activeColumn: column,
      isAsc: isAsc,
    });
  };
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setSortBy(value);
        setPage(1);
      }, 500),
    []
  );
  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };

  console.log('Check startDate: ', dayjs(startDate).format('YYYY'));
  console.log('Check endDate: ', dayjs(endDate).format('YYYY'));

  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteDepartmentOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteDepartmentMultipleMutation();
  const handleConfirmAction = async () => {
    try {
      if (selectedDepartment.length > 0) {
        await deleteMultiple({ ids: selectedDepartment }).unwrap();
        toast.success('Các khoa đã được xóa thành công.');
      } else {
        await deleteOne({ id: selectId }).unwrap();
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
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingDeleteOne]);
  return (
    <>
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản lý khoa</h1>
        <div className="flex flex-wrap justify-between">
          {/* Ô tìm kiếm */}
          <div className="ml-5 flex gap-8 ">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã khoa"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full md:w-auto"
            />
            {/* Bộ chọn năm */}
            <div className="flex gap-4">
              <YearPickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-5 sm:mt-5 " style={{ marginTop: '10px' }}>
            <Link
              href={'/admin/school/department/AddDepartment'}
              className="flex h-[42px] items-center rounded-[8px] border-[1px] bg-[#34a853] px-5 py-2 text-white transition duration-300 hover:bg-[#2e7b42]">
              <AddIcon className="mr-1 h-6 w-6 text-white" />
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
                  <span className="min-w-max" onClick={() => handleSort('facultyCode', !(sortState.activeColumn === 'facultyCode' && sortState.isAsc))}>
                    Mã khoa
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'facultyCode' && sortState.isAsc === true} onClick={() => handleSort('facultyCode', true)} />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'facultyCode' && sortState.isAsc === false}
                      onClick={() => handleSort('facultyCode', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('facultyName', !(sortState.activeColumn === 'facultyName' && sortState.isAsc))}>
                    Tên khoa
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'facultyName' && sortState.isAsc === true} onClick={() => handleSort('facultyName', true)} />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'facultyName' && sortState.isAsc === false}
                      onClick={() => handleSort('facultyName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max">Trưởng khoa</span>
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
        <PopupConfirmAction text="Bạn có chắc chắn muốn xóa" name={`${name} này không?`} onClick={handleConfirmAction} />
      )}

      <PaginationComponent
        count={departments?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={departments?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};

export default Department;
