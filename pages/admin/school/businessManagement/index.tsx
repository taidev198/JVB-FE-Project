import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Tooltip, Pagination } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import DeleteIcon from '@mui/icons-material/Delete';
interface FormDataRegisterSchool {
  search_school: string;
}

const validationSchema = Yup.object({
  search_school: Yup.string().required('Tên khoa không được bỏ trống').max(100, 'Tên khoa không được quá 100 kí tự'),
});

const BusinessManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterSchool>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormDataRegisterSchool> = data => {
    console.log(data);
  };

  // Data giả lập
  const mockData = [
    { major_code: 'CNTT', major_name: 'Công Nghệ Thông Tin', credit_requirement: 124, number_of_students: 578, faculty_name: 'Công Nghệ Thông Tin' },
    { major_code: 'MKT', major_name: 'Marketing', credit_requirement: 324, number_of_students: 278, faculty_name: 'Marketing' },
    { major_code: 'TY', major_name: 'Thú Y', credit_requirement: 294, number_of_students: 400, faculty_name: 'Thú Y' },
    { major_code: 'TKDH', major_name: 'Thiết Kế Đồ Họa', credit_requirement: 124, number_of_students: 578, faculty_name: 'Thiết Kế Đồ Họa' },
    { major_code: 'KCH', major_name: 'Khảo Cổ Học', credit_requirement: 124, number_of_students: 578, faculty_name: 'Khảo Cổ Học' },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách quản ngành học</h1>
        <div className="flex items-center gap-3 ">
          <div className="w-[400px]">
            <Input
              type="text"
              name="search_company"
              placeholder="Tìm kiếm ngành học"
              control={control}
              error={errors.search_school?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Tìm kiếm" />
          <MyButton type="submit" text="Thêm Khoa mới" />
        </div>
      </form>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã Ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Tên Ngành</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số Tín Chỉ</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Số Sinh Viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Khoa</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Thao Tác</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map(item => (
              <tr key={item.major_code} className="bg-[#F7F6FE]">
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.major_code}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.major_name}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.credit_requirement}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.number_of_students}</p>
                </td>
                <td className="p-3 sm:px-5 sm:py-4">
                  <p className="min-w-max">{item.faculty_name}</p>
                </td>
                <td className="gap-2 px-2 py-4 sm:px-5 ">
                  <div className="flex items-center">
                    <p className="min-w-max">
                      <Link href={`/admin/school/businessManagement/detalBusinessManagement`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton>
                            <VisibilityIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link href={`/admin/school/detalBusinessManagement/update`}>
                        <Tooltip title="Sửa khoa">
                          <IconButton>
                            <BorderColorIcon className="text-purple-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link href={`/admin/school/detalBusinessManagement/delete`}>
                        <Tooltip title="Xóa khoa">
                          <IconButton>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};

export default BusinessManagement;
