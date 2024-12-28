import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Checkbox } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { debounce } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useDeleteBusinessMultipleMutation, useDeleteBusinessOneMutation, useGetAllBusinessQuery, useGetAllFaculityQuery } from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { setKeyword, setPage, setIdFaculty, resetFilters } from '@/store/slices/filtersSlice';

const BusinessManagement = () => {
  const dispatch = useAppDispatch();
  const { page, keyword, size, idFaculty } = useAppSelector(state => state.filter);
  const name = useAppSelector(state => state.global.name);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedBusiness, setSelectedBusiness] = useState<number[]>([]);
  const { data: dataDepartments, isLoading: isLoadingGetAllDepartment } = useGetAllFaculityQuery(undefined, { refetchOnMountOrArgChange: true });
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

  const { data: business, isLoading } = useGetAllBusinessQuery(
    {
      page: page,
      size: size,
      keyword,
      idFaculty: idFaculty,
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
    return () => {
      dispatch(resetFilters());
    };
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
                <p className="min-w-max">STT</p>
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
                <p className="min-w-max">Khoa</p>
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
                  <td className="p-3 text-center sm:px-5 sm:py-4">
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
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa ngành học {name} này không?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn ngành học khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}

      <PaginationComponent
        count={business?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={business?.data.totalElements}
        totalTitle={'ngành học'}
      />
    </>
  );
};

export default BusinessManagement;
