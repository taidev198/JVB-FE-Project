/* eslint-disable no-console */
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { TextField, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useDeleteBusinessMultipleMutation, useDeleteBusinessOneMutation, useGetAllBusinessQuery, useGetAllFaculityQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import { Button as MyButton } from '@/components/Common/Button';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';

const BusinessManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [idFaculty, setIdFaculty] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const name = useAppSelector(state => state.global.name);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedBusiness, setSelectedBusiness] = useState<number[]>([]);
  const { data: dataDepartments, isLoading: isLoadingGetAllDepartment } = useGetAllFaculityQuery(undefined, { refetchOnMountOrArgChange: true });
  const [creditRequirementMin, setCreditRequirementMin] = useState<number>(0);
  const [creditRequirementMax, setCreditRequirementMax] = useState<number>(70);
  const applyCreditFilter = (min: number, max: number) => {
    console.log('Applying filter with min:', min, 'and max:', max);
  };
  const handleMinChange = (value: string) => {
    const min = Number(value);
    setCreditRequirementMin(min);
    applyCreditFilter(min, creditRequirementMax);
  };

  const handleMaxChange = (value: string) => {
    const max = Number(value);
    setCreditRequirementMax(max);
    applyCreditFilter(creditRequirementMin, max);
  };
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
        setSortBy(value);
      }, 500),
    []
  );
  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };
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
  const { data: business, isLoading } = useGetAllBusinessQuery(
    {
      page: page,
      size: size,
      keyword,
      idFaculty: idFaculty,
      creditRequirementMin,
      creditRequirementMax,
      sortBy: sortBy || 'majorCode:asc',
    },
    { refetchOnMountOrArgChange: true }
  );
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteBusinessOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteBusinessMultipleMutation();
  const handleConfirmAction = async () => {
    try {
      if (selectedBusiness.length > 0) {
        await deleteMultiple({ ids: selectedBusiness }).unwrap();
        toast.success('Các ngành học đã được xóa thành công');
      } else {
        await deleteOne({ id: selectId }).unwrap();
        toast.success('Ngành học đã được xóa thành công');
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
    dispatch(setLoading(isLoading || isLoadingDeleteOne || isLoadingMultiple || isLoadingGetAllDepartment));
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingDeleteOne, isLoadingGetAllDepartment]);
  return (
    <>
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản ngành học</h1>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã ngành học "
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
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
                setIdFaculty(selectedOption.value ? Number(selectedOption.value) : null);
              }}
              className="w-full cursor-pointer "
            />
            {/* Lọc số tín chỉ */}
            <div className="flex items-center gap-4">
              <TextField
                id="credit-min"
                label="Số tín chỉ tối thiểu"
                type="number"
                variant="outlined"
                size="small"
                value={creditRequirementMin}
                onChange={e => handleMinChange(e.target.value)}
                className="w-full"
              />
              <TextField
                id="credit-max"
                label="Số tín chỉ tối đa"
                type="number"
                variant="outlined"
                size="small"
                value={creditRequirementMax}
                onChange={e => handleMaxChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="ml-auto flex justify-items-center gap-5">
            <Link
              href={'/admin/school/businessManagement/AddBusiness'}
              className="rounded-[8px] border-[1px] bg-[#34a853] px-5 py-2 text-white transition duration-300 hover:bg-[#2e7b42]">
              <AddIcon className="mr-1 h-6 w-6 items-center text-white" />
              Thêm mới
            </Link>
            <MyButton
              type="submit"
              text="Xóa ngành"
              onClick={() => {
                dispatch(setName('đã chọn'));
                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
              }}
              className="bg-red-custom"
              disabled={!selectedBusiness.length}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedBusiness.length > 0 && business?.data.content.length > 0}
                  indeterminate={selectedBusiness.length > 0 && selectedBusiness.length < (business?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              <th className="p-3 py-4 text-left sm:px-3">
                <p className="min-w-max">STT</p>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('majorCode', !(sortState.activeColumn === 'majorCode' && sortState.isAsc))}>
                    Mã ngành
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'majorCode' && sortState.isAsc === true} onClick={() => handleSort('majorCode', true)} />
                    <ButtonArrow isSort={sortState.activeColumn === 'majorCode' && sortState.isAsc === false} onClick={() => handleSort('majorCode', false)} />
                  </span>
                </div>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('majorName', !(sortState.activeColumn === 'majorName' && sortState.isAsc))}>
                    Tên ngành
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'majorName' && sortState.isAsc === true} onClick={() => handleSort('majorName', true)} />
                    <ButtonArrow isSort={sortState.activeColumn === 'majorName' && sortState.isAsc === false} onClick={() => handleSort('majorName', false)} />
                  </span>
                </div>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <div className="flex items-center">
                  <span
                    className="min-w-max"
                    onClick={() => handleSort('creditRequirement', !(sortState.activeColumn === 'creditRequirement' && sortState.isAsc))}>
                    Số tín chỉ
                  </span>
                  <span>
                    <ButtonUp
                      isSort={sortState.activeColumn === 'creditRequirement' && sortState.isAsc === true}
                      onClick={() => handleSort('creditRequirement', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'creditRequirement' && sortState.isAsc === false}
                      onClick={() => handleSort('creditRequirement', false)}
                    />
                  </span>
                </div>
              </th>

              <th className="p-3 text-left sm:px-5 sm:py-4">
                <div className="flex items-center">
                  <span
                    className="min-w-max"
                    onClick={() => handleSort('faculty.facultyName', !(sortState.activeColumn === 'faculty.facultyName' && sortState.isAsc))}>
                    Khoa
                  </span>
                  <span className="">
                    <ButtonUp
                      isSort={sortState.activeColumn === 'facultyName' && sortState.isAsc === true}
                      onClick={() => handleSort('faculty.facultyName', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'facultyName' && sortState.isAsc === false}
                      onClick={() => handleSort('faculty.facultyName', false)}
                    />
                  </span>
                </div>
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
                  <td className="p-3 text-center sm:px-3 sm:py-4">
                    <Checkbox color="primary" checked={selectedBusiness.includes(item.id)} onChange={() => handleSelectBusiness(item.id)} size="small" />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{index + 1 + (page - 1) * size}</p>
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
                    <p className="min-w-max">{item.faculty.facultyName}</p>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/school/businessManagement/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonUpdate href={`/admin/school/businessManagement/update/${item.id}`} onClick={() => dispatch(setId(item.id))} />
                      <ButtonDelete
                        onClick={() => {
                          handleOpenConfirm(item.id);
                          dispatch(setName(item.majorName));
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

      {showBackdrop === BackdropType.DeleteConfirmation && (
        <PopupConfirmAction text="Bạn có chắc chắn muốn xóa ngành học" name={`${name} này không?`} onClick={handleConfirmAction} />
      )}

      <PaginationComponent
        count={business?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={business?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};

export default BusinessManagement;
