import React, { useState } from 'react';
import { Chip, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, TextField, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import AddDepartment from '@/components/Admin/school/Department/AddDepartment';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button, Button as MyButton } from '@/components/Common/Button';

const StudentsManagement = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentStatus, setStudentStatus] = useState('');

  // Data giả lập
  const mockData = [
    {
      id: 1,
      studentCode: 'STU029',
      fullName: 'Trần Minh Anh',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi//image/upload/v1731915716/default0',
      email: 'student29@example.com',
      gender: 'MALE',
      phoneNumber: '0903456789',
      yearOfEnrollment: 2020,
      address: {
        houseNumber: 'Nhà số 29',
        ward: {
          id: 29,
          wardName: 'Phường Tràng Tiền',
        },
        district: {
          id: 2,
          districtName: 'Quận Hoàn Kiếm',
        },
        province: {
          id: 1,
          provinceName: ' Hà Nội',
        },
      },
      major: {
        id: 29,
        majorName: 'Kỹ thuật Dân dụng',
        majorCode: 'MAJ029',
        creditRequirement: 120,
        majorDescription: 'Ngành học đào tạo về các lĩnh vực nghiên cứu kỹ thuật dân dụng, hạ tầng và các công trình giao thông công cộng.',
        numberOfStudents: 400,
        faculty: {
          id: 1,
          facultyCode: 'FAC001',
          facultyName: 'Khoa Kỹ thuật',
          establishYear: 1990,
          nameDean: 'Nguyễn Mạnh Cường',
          address: 'Tầng 1, Phòng 101, Trường Đại học Bách Khoa Hà Nội',
          facultyDescription: 'Khoa Kỹ thuật chuyên đào tạo các ngành kỹ thuật cơ khí, xây dựng và công nghệ thông tin.',
          university: {
            id: 1,
            universityCode: 'HUST',
            universityName: 'Đại học Bách Hà Nội',
          },
          isDelete: false,
        },
        majorFields: [],
        isDelete: false,
      },
      gpa: 3.2,
      dateOfBirth: '2001-07-25',
      studentStatus: 'GRADUATED',
    },
    {
      id: 2,
      studentCode: 'ph54029',
      fullName: 'Trần Văn B',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi//image/upload/v1731915716/default0',
      email: 'student29@example.com',
      gender: 'MALE',
      phoneNumber: '0903456789',
      yearOfEnrollment: 2020,
      address: {
        houseNumber: 'Nhà số 29',
        ward: {
          id: 29,
          wardName: 'Phường Tràng Tiền',
        },
        district: {
          id: 2,
          districtName: 'Quận Hoàn Kiếm',
        },
        province: {
          id: 1,
          provinceName: ' Hà Nội',
        },
      },
      major: {
        id: 29,
        majorName: 'Kỹ thuật Dân dụng',
        majorCode: 'MAJ029',
        creditRequirement: 120,
        majorDescription: 'Ngành học đào tạo về các lĩnh vực nghiên cứu kỹ thuật dân dụng, hạ tầng và các công trình giao thông công cộng.',
        numberOfStudents: 400,
        faculty: {
          id: 1,
          facultyCode: 'FAC001',
          facultyName: 'Khoa Kỹ thuật',
          establishYear: 1990,
          nameDean: 'Nguyễn Mạnh Cường',
          address: 'Tầng 1, Phòng 101, Trường Đại học Bách Khoa Hà Nội',
          facultyDescription: 'Khoa Kỹ thuật chuyên đào tạo các ngành kỹ thuật cơ khí, xây dựng và công nghệ thông tin.',
          university: {
            id: 1,
            universityCode: 'HUST',
            universityName: 'Đại học Bách Hà Nội',
          },
          isDelete: false,
        },
        majorFields: [],
        isDelete: false,
      },
      gpa: 3.5,
      dateOfBirth: '2001-07-25',
      studentStatus: 'Dropped Out',
    },
    {
      id: 3,
      studentCode: 'Ph75832',
      fullName: 'Nguyễn Văn C',
      avatarUrl: 'https://res.cloudinary.com/dumvp2ixi//image/upload/v1731915716/default0',
      email: 'student29@example.com',
      gender: 'MALE',
      phoneNumber: '0903456789',
      yearOfEnrollment: 2020,
      address: {
        houseNumber: 'Nhà số 29',
        ward: {
          id: 29,
          wardName: 'Phường Tràng Tiền',
        },
        district: {
          id: 2,
          districtName: 'Quận Hoàn Kiếm',
        },
        province: {
          id: 1,
          provinceName: ' Hà Nội',
        },
      },
      major: {
        id: 29,
        majorName: 'Kỹ thuật Dân dụng',
        majorCode: 'MAJ029',
        creditRequirement: 120,
        majorDescription: 'Ngành học đào tạo về các lĩnh vực nghiên cứu kỹ thuật dân dụng, hạ tầng và các công trình giao thông công cộng.',
        numberOfStudents: 400,
        faculty: {
          id: 1,
          facultyCode: 'FAC001',
          facultyName: 'Khoa Kỹ thuật',
          establishYear: 1990,
          nameDean: 'Nguyễn Mạnh Cường',
          address: 'Tầng 1, Phòng 101, Trường Đại học Bách Khoa Hà Nội',
          facultyDescription: 'Khoa Kỹ thuật chuyên đào tạo các ngành kỹ thuật cơ khí, xây dựng và công nghệ thông tin.',
          university: {
            id: 1,
            universityCode: 'HUST',
            universityName: 'Đại học Bách Hà Nội',
          },
          isDelete: false,
        },
        majorFields: [],
        isDelete: false,
      },
      gpa: 3.5,
      dateOfBirth: '2001-07-25',
      studentStatus: 'In Progress',
    },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản lý sinh viên</h1>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center">
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              <InputLabel id="demo-select-small-label">Trạng thái</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={studentStatus}
                label="Chọn"
                onChange={e => setStudentStatus(e.target.value)}>
                <MenuItem value="all">
                  <em>Tất cả</em>
                </MenuItem>
                <MenuItem value={'active'}>Hoạt động</MenuItem>
                <MenuItem value={'disable'}>Tạm ngừng</MenuItem>
              </Select>
            </FormControl>
            <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" />
          </div>
          <div>
            <MyButton type="submit" text="Thêm mới" onClick={() => dispatch(setBackdrop(BackdropType.AddModal))} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
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
                <p className="min-w-max">Email</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Điểm TB</p>
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
                <p className="min-w-max">Thao Tác</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.id}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">
                    <Image src={item.avatarUrl} alt="anh" width={50} height={50} />
                  </p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.major.faculty.facultyCode}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.fullName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.email}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.gpa}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.major.majorName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.major.faculty.facultyName}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <Chip
                    label={item.studentStatus}
                    sx={{
                      backgroundColor:
                        item.studentStatus === 'GRADUATED'
                          ? '#EBF9F1'
                          : item.studentStatus === 'Dropped Out'
                          ? '#FFF4E5'
                          : item.studentStatus === 'In Progress'
                          ? '#FFFAE5'
                          : '#FEE5E5',
                      color:
                        item.studentStatus === 'GRADUATED'
                          ? '#1F9254'
                          : item.studentStatus === 'Dropped Out'
                          ? '#FFA726'
                          : item.studentStatus === 'In Progress'
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
      {/* Xóa Khoa */}
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

      {/* FormAdd*/}
      {backdropType === BackdropType.AddModal && (
        <BackDrop isCenter={true}>
          <AddDepartment />
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
