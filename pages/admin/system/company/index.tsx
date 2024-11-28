import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, Tooltip, Pagination } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';

interface FormDataRegisterCompany {
  search_company: string;
}

const validationSchema = Yup.object({
  search_company: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
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
    { id: 1, name: 'Công ty A', field: 'Công nghệ', employees: 150, status: 'Hoạt động' },
    { id: 2, name: 'Công ty B', field: 'Dịch vụ', employees: 200, status: 'Tạm ngừng' },
    { id: 3, name: 'Công ty C', field: 'Bán lẻ', employees: 50, status: 'Hoạt động' },
    { id: 4, name: 'Công ty D', field: 'Sản xuất', employees: 300, status: 'Tạm ngừng' },
    { id: 5, name: 'Công ty E', field: 'Vận tải', employees: 100, status: 'Hoạt động' },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản doanh nghiệp</h1>
        <div className="flex items-center gap-3 ">
          <div className="w-[400px]">
            <Input
              type="text"
              name="search_company"
              placeholder="Tìm kiếm công ty"
              control={control}
              error={errors.search_company?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Tìm kiếm" />
        </div>
      </form>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên Công Ty</th>
              <th className="px-5 py-4 text-left">Ngành Nghề</th>
              <th className="px-5 py-4 text-left">Số nhân viên</th>
              <th className="px-5 py-4 text-left">Trạng Thái</th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map(item => (
              <tr key={item.id} className="bg-[#F7F6FE]">
                <td className="px-5 py-4">{item.id}</td>
                <td className="px-5 py-4">{item.name}</td>
                <td className="px-5 py-4">{item.field}</td>
                <td className="px-5 py-4">{item.employees}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.status}
                    sx={{
                      backgroundColor: item.status === 'Hoạt động' ? '#EBF9F1' : '#FFF4E5',
                      color: item.status === 'Hoạt động' ? '#1F9254' : '#FFA726',
                    }}
                  />
                </td>
                <td className="flex gap-2 px-5 py-4">
                  <Link href={`/admin/system/company/detail?id=${item.id}`}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton>
                        <VisibilityIcon color="success" />
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
