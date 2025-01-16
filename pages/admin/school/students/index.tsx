import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { Checkbox, Chip, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';
import { useAppSelector } from '@/store/hooks';
import { Button as MyButton } from '@/components/Common/Button';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import {
  useDeleteStudentMultipleMutation,
  useDeleteStudentOneMutation,
  useGetAllFaculityQuery,
  useGetAllMajorByIdFacultyQuery,
  useGetAllStudentsQuery,
} from '@/services/adminSchoolApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import { StatusStudentTitle } from '@/utils/app/const';

const StudentsManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [department, setDepartment] = useState<number | null>(null);
  const [major, setMajor] = useState<number | null>(null);
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const idStudent = useAppSelector(state => state.global.id);
  const name = useAppSelector(state => state.global.name);
  const [status, setStatus] = useState<string | null>(null);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
        setSortBy(value);
      }, 500),
    []
  );

  // Call api
  const { data: dataDepartment, isLoading: isLoadingGetAllDepartment } = useGetAllFaculityQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: dataMajor } = useGetAllMajorByIdFacultyQuery({ id: department }, { skip: department === null, refetchOnMountOrArgChange: true });
  const { data: students, isLoading: isLoadingGetAllSt } = useGetAllStudentsQuery(
    {
      page,
      size,
      keyword: keyword,
      majorId: major,
      facultyId: department,
      status,
      sortBy: sortBy || 'studentCode:asc',
    },
    { refetchOnMountOrArgChange: true }
  );
  const [sortState, setSortState] = React.useState({
    activeColumn: null,
    isAsc: null,
  });

  const handleSort = (column: String, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy),
      setSortState({
        activeColumn: column,
        isAsc: isAsc,
      });
  };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allStudentIds = students?.data.content.map(student => student.id);
      setSelectedStudents(allStudentIds ?? []);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev => (prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]));
  };

  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteStudentOneMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteStudentMultipleMutation();
  const handleDelete = async () => {
    try {
      if (selectedStudents.length > 0) {
        await deleteMultiple({ ids: selectedStudents }).unwrap();
        toast.success('Các sinh viên đã được xóa thành công.');
      } else {
        await deleteOne({ id: idStudent }).unwrap();
        toast.success('Sinh viên đã được xóa thành công.');
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

  useEffect(() => {
    dispatch(setLoading(isLoadingDeleteOne || isLoadingGetAllDepartment || isLoadingGetAllSt || isLoadingMultiple));
  }, [dispatch, isLoadingDeleteOne, isLoadingGetAllDepartment, isLoadingGetAllSt, isLoadingMultiple]);
  return (
    <>
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản lý sinh viên</h1>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[70%,30%]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên,mã sinh viên"
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
                ...(dataDepartment?.data || []).map(department => ({
                  value: department.id,
                  label: department.facultyName,
                })),
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string | null> }) => {
                const selectedValue = selectedOption.value ? Number(selectedOption.value) : null;
                setDepartment(selectedValue);
                if (selectedValue === null) {
                  setMajor(null);
                }
              }}
              className="w-full cursor-pointer"
            />
            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Trạng thái' },
                { value: 'IN_PROGRESS', label: 'Đang học' },
                { value: 'GRADUATED', label: 'Đã tốt nghiệp' },
                { value: 'DROPPED_OUT', label: 'Thôi học' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setStatus(selectedOption.value)}
              className="w-[160px] cursor-pointer"
            />
            <Select
              placeholder="Chọn ngành"
              closeMenuOnSelect={true}
              value={
                major !== null
                  ? {
                      value: major,
                      label: Array.isArray(dataMajor?.data) ? dataMajor.data.find(item => item.id === major)?.majorName || 'Tất cả' : 'Tất cả',
                    }
                  : { value: null, label: 'Tất cả' }
              }
              options={[
                { value: null, label: 'Tất cả' },
                ...(Array.isArray(dataMajor?.data) ? dataMajor.data : []).map(major => ({
                  value: major.id,
                  label: major.majorName,
                })),
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string | null> }) => {
                setMajor(selectedOption.value ? Number(selectedOption.value) : null);
              }}
              className="w-full cursor-pointer"
            />
          </div>
          <div className="ml-auto flex justify-items-center gap-5">
            <Link
              href={'/admin/school/students/add'}
              className="h-[42px] rounded-[8px] border-[1px] bg-[#34a853] px-5 py-2 text-white transition duration-300 hover:bg-[#2e7b42]">
              <AddIcon className="mr-1 h-6 w-6 items-center text-white" />
              Thêm mới
            </Link>
            <MyButton
              type="submit"
              text="Xóa sinh viên"
              onClick={() => {
                dispatch(setName('đã chọn'));
                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
              }}
              className="bg-red-custom"
              disabled={!selectedStudents.length}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedStudents.length > 0 && students?.data.content.length > 0}
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < (students?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              <th className="p-3 py-4 text-left sm:px-3">
                <p className="min-w-max">STT</p>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('studentCode', !(sortState.activeColumn === 'studentCode' && sortState.isAsc))}>
                    Mã sinh viên
                  </span>
                  <span>
                    <ButtonUp isSort={sortState.activeColumn === 'studentCode' && sortState.isAsc === true} onClick={() => handleSort('studentCode', true)} />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'studentCode' && sortState.isAsc === false}
                      onClick={() => handleSort('studentCode', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('fullName', !(sortState.activeColumn === 'fullName' && sortState.isAsc))}>
                    Họ và tên
                  </span>
                  <span>
                    <ButtonUp isSort={sortState.activeColumn === 'fullName' && sortState.isAsc === true} onClick={() => handleSort('fullName', true)} />
                    <ButtonArrow isSort={sortState.activeColumn === 'fullName' && sortState.isAsc === false} onClick={() => handleSort('fullName', false)} />
                  </span>
                </div>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('major.majorName', !(sortState.activeColumn === 'major.majorName' && sortState.isAsc))}>
                    Ngành
                  </span>
                  <span>
                    <ButtonUp
                      isSort={sortState.activeColumn === 'majorName.majorName' && sortState.isAsc === true}
                      onClick={() => handleSort('major.majorName', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'major.majorName' && sortState.isAsc === false}
                      onClick={() => handleSort('major.majorName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span
                    className="min-w-max"
                    onClick={() => handleSort('major.faculty.facultyName', !(sortState.activeColumn === 'major.faculty.facultyName' && sortState.isAsc))}>
                    Khoa
                  </span>
                  <span>
                    <ButtonUp
                      isSort={sortState.activeColumn === 'major.faculty.facultyName' && sortState.isAsc === true}
                      onClick={() => handleSort('major.faculty.facultyName', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'major.faculty.facultyName' && sortState.isAsc === false}
                      onClick={() => handleSort('major.faculty.facultyName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Trạng thái</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Hành động</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {students?.data.content.length > 0 ? (
              students?.data.content.map((student, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 text-center sm:px-3 sm:py-4">
                    <Checkbox color="primary" checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} size="small" />
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="w-fit">{index + 1 + (page - 1) * size}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.studentCode}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p> {student.fullName}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.major.majorName}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.major.faculty.facultyName}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Chip
                      label={StatusStudentTitle(student.studentStatus).title}
                      style={{
                        color: `${StatusStudentTitle(student.studentStatus).color}`,
                        background: `${StatusStudentTitle(student.studentStatus).bg}`,
                      }}
                    />
                  </td>
                  <td className=" py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/school/students/${student.id}`} onClick={() => dispatch(setId(student.id))} />

                      <ButtonUpdate href={`/admin/school/students/update/${student.id}`} onClick={() => dispatch(setId(student.id))} />

                      <ButtonDelete
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setId(student.id));
                          dispatch(setName(student.fullName));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base">
                  <p>Không có dữ liệu sinh viên nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Xóa Sinh viên */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <PopupConfirmAction text={'Bạn có chắc chắn muốn xóa sinh viên'} name={`${name}`} onClick={handleDelete} />
      )}
      {/* Pagination */}
      <PaginationComponent
        size={size}
        page={page}
        count={students?.data.totalPages}
        onPageChange={(event, value) => setPage(value)}
        totalItem={students?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};

export default StudentsManagement;
