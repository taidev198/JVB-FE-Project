import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, Pagination, Tooltip } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

import { Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';

interface FormDataRegisterCompany {
  search_company: string;
}
const validationSchema = Yup.object({
  search_company: Yup.string().required('Tên tài khoản admin không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});

const AdminSystemSubAdmin = () => {
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header */}
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản quản trị viên</h1>
        <div className="flex items-center gap-3 ">
          <div className="w-[400px]">
            <Input
              type="text"
              name="search_company"
              placeholder="Tìm kiếm quản trị viên"
              control={control}
              error={errors.search_company?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Tìm kiếm" />
        </div>
      </form>
      <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
        <thead className="bg-white">
          <tr>
            <th className="px-5 py-4 text-left">STT</th>
            <th className="px-5 py-4 text-left">Tên tài khoản</th>
            <th className="px-5 py-4 text-left">Email</th>
            <th className="px-5 py-4 text-left">Vai trò</th>
            <th className="px-5 py-4 text-left">Trạng Thái</th>
            <th className="px-5 py-4 text-left">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-[#F7F6FE]">
            <td className="px-5 py-4">1</td>
            <td className="px-5 py-4">Nguyễn Văn Admin</td>
            <td className="px-5 py-4">nguyenvanaadmin@gmail.com</td>
            <td className="px-5 py-4">Supper Admin</td>
            <td className="px-5 py-4 text-red-500">
              <Chip label="Hoạt động" sx={{ backgroundColor: '#EBF9F1', color: '#1F9254' }} />
            </td>
            <td className="flex gap-2 px-5 py-4">
              <Link href={'/admin/system/sub-admin/detail'}>
                <Tooltip title="Xem chi tiết">
                  <IconButton>
                    <VisibilityIcon color="success" />
                  </IconButton>
                </Tooltip>
              </Link>
            </td>
          </tr>
          <tr className="bg-[#F7F6FE]">
            <td className="px-5 py-4">2</td>
            <td className="px-5 py-4">Lê Thị Content</td>
            <td className="px-5 py-4">lethicontent@gmail.com</td>
            <td className="px-5 py-4">Content Manager</td>
            <td className="px-5 py-4 text-red-500">
              <Chip label="Tạm ngừng" color="warning" />
            </td>
            <td className="flex gap-2 px-5 py-4">
              <Link href={'/admin/system/sub-admin/detail'}>
                <Tooltip title="Xem chi tiết">
                  <IconButton>
                    <VisibilityIcon color="success" />
                  </IconButton>
                </Tooltip>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  );
};
export default AdminSystemSubAdmin;
