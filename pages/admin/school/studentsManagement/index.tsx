import React, { useState } from 'react';
import { Checkbox, Chip, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Select from 'react-select';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useGetAllDepartmentsPortalQuery, useGetAllStudentsQuery } from '@/services/adminSchoolApi';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { StatusStudent } from '@/utils/app/const';

const StudentsManagement = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState<number | null>();
  const [major, setMajor] = useState<number | null>(null);
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);

  // Call api
  const { data: dataDepartment } = useGetAllDepartmentsPortalQuery();
  const { data: students } = useGetAllStudentsQuery({ page: currentPage, size: 10, keyword: keyword, majorId: major, facultyId: department });

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allStudentIds = mockData.map(student => student.id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev => (prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]));
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Danh sách quản lý sinh viên</h1>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Select
              placeholder="Chọn khoa"
              closeMenuOnSelect={true}
              options={(dataDepartment?.data || []).map(department => ({
                value: department.id,
                label: department.facultyName,
              }))}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setDepartment(Number(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
            <Select
              placeholder="Chọn ngành"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'APPROVED', label: 'Đã duyệt' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'REJECTED', label: 'Từ chối' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setMajor(Number(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
            <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
          </div>
          <div className="flex justify-items-center gap-5">
            <Link href={'/admin/school/studentsManagement/add'}>
              <MyButton type="submit" text="Thêm mới" />
            </Link>
            <MyButton
              type="submit"
              text="Xóa tất cả sinh viên đã chọn"
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
                  checked={selectedStudents.length === students?.data.content.length}
                  indeterminate={selectedStudents.length > 0 && selectedStudents.length < students?.data.content.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">STT</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Ảnh đại diện</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã Sinh Viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Họ Và Tên Sinh Viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Khoa</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Trạng Thái</p>
              </th>

              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Hành Động</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {students?.data.content.map((student, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <Checkbox color="primary" checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} />
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{student.id}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">
                    <Image src={student.avatarUrl} alt="anh" width={50} height={50} />
                  </p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{student.major.faculty.facultyCode}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{student.fullName}</p>
                </td>
                {/* <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.email}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
<p className="min-w-max">{item.gpa}</p>
                </td> */}
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{student.major.majorName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{student.major.faculty.facultyName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <Chip
                    label={StatusStudent(student.studentStatus)}
                    sx={{
                      backgroundColor:
                        student.studentStatus === 'GRADUATED'
                          ? '#EBF9F1'
                          : student.studentStatus === 'DROPPED_OUT'
                          ? '#FFF4E5'
                          : student.studentStatus === 'IN_PROGRESS'
                          ? '#FFFAE5'
                          : '#FEE5E5',
                      color:
                        student.studentStatus === 'GRADUATED'
                          ? '#1F9254'
                          : student.studentStatus === 'DROPPED_OUT'
                          ? '#FFA726'
                          : student.studentStatus === 'IN_PROGRESS'
                          ? '#FFB800'
                          : '#F44336',
                    }}
                  />
                </td>
                <td className="gap-2 px-2 py-4 sm:px-5 ">
                  <div className="flex items-center">
                    <p className="min-w-max">
                      <Link href={`/admin/school/studentsManagement/detailStudentsManagement`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton>
                            <VisibilityIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link href={`/admin/school/studentManagement/update`}>
                        <Tooltip title="Sửa khoa">
                          <IconButton>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Xóa sinh viên">
                        <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
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
      {/* Xóa Sinh viên */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sinh viên khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} />
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

export default StudentsManagement;
