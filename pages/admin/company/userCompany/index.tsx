import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, Tooltip, Pagination } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import { Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';

interface FormDataRegisterCompany {
  search_employee: string;
}

const validationSchema = Yup.object({
  search_employee: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});

const AdminSystemCompany = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterCompany>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormDataRegisterCompany> = data => {
    console.log(data);
  };

  // Data giả lập
  const mockData = [
    { employee_code: '#20462', full_name: 'Matt Dickerson', email: 'Dickerson@gmail.com', create_at: '22/05/2022', role_name: 'Quản lý', phone_number: '0123456789', status_account:'Hoạt động' },
    { employee_code: '#18933', full_name: 'Wiktoria', email: 'Wiktoria@gmail.com', create_at: '13/05/2022', role_name: 'Nhân viên', phone_number: '0123456789', status_account:'Tạm ngừng' },
    { employee_code: '#20461', full_name: 'Matt Dickerson', email: 'Dickerson@gmail.com', create_at: '13/05/2022', role_name: 'Quản lý', phone_number: '0123456789', status_account:'Hoạt động' },
    { employee_code: '#18933', full_name: 'Wiktoria', email: 'Wiktoria@gmail.com', create_at: '22/05/2022', role_name: 'Nhân viên', phone_number: '0123456789', status_account:'Tạm ngừng' },
    { employee_code: '#20462', full_name: 'Matt Dickerson', email: 'Dickerson@gmail.com', create_at: '13/05/2022', role_name: 'Quản lý', phone_number: '0123456789', status_account:'Hoạt động' },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản nhân viên</h1>
        <div className="flex items-center gap-3 justify-between ">
          <div className="w-[400px]">
            <Input
              type="text"
              name="search_employee"
              placeholder="Tìm kiếm"
              control={control}
              error={errors.search_employee?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Thêm nhân viên" />
        </div>
      </form>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">Mã</th>
              <th className="px-5 py-4 text-left">Tên nhân viên</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Ngày đăng ký</th>
              <th className="px-5 py-4 text-left">Vai trò</th>
              <th className="px-5 py-4 text-left">Số điện thoại</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map(item => (
              <tr key={item.employee_code} className="bg-[#F7F6FE]">
                <td className="px-5 py-4">{item.employee_code}</td>
                <td className="px-5 py-4">{item.full_name}</td>
                <td className="px-5 py-4">{item.email}</td>
                <td className="px-5 py-4">{item.create_at}</td>
                <td className="px-5 py-4">{item.role_name}</td>
                <td className="px-5 py-4">{item.phone_number}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.status_account}
                    sx={{
                      backgroundColor: item.status_account === 'Hoạt động' ? '#EBF9F1' : '#FFF4E5',
                      color: item.status_account === 'Hoạt động' ? '#1F9254' : '#FFA726',
                    }}
                  />
                </td>
                <td className="flex gap-2 px-5 py-4">
                  <Link href={`/admin/company/userCompany/detailUserCompany?employee_code=${item.employee_code}`}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton>
                        <VisibilityIcon color="success" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Sửa">
                      <IconButton>
                        <BorderColorIcon className='text-purple-500' />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <IconButton>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>

                  </Link>
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

export default AdminSystemCompany;
