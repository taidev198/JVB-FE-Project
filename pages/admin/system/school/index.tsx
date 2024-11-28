import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { Chip, IconButton, Pagination, Tooltip } from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { Button, Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { toggleBackdrop } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';

interface FormDataRegisterCompany {
  search_company: string;
}
const validationSchema = Yup.object({
  search_company: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});

const AdminSystemSchool = () => {
  const dispatch = useDispatch();
  const showBackdrop = useAppSelector(state => state.global.showBackdrop);
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
        <h1 className="mb-5 font-bold">Doanh sách tài khoản trường đại học</h1>
        <div className="flex items-center gap-3 ">
          <div className="w-[400px]">
            <Input
              type="text"
              name="search_company"
              placeholder="Tìm kiếm trường đại học"
              control={control}
              error={errors.search_company?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Tìm kiếm" />
        </div>
      </form>
      <table className=" table-auto overflow-x-auto rounded-lg rounded-b-md bg-white text-[14px]">
        <thead className="bg-white">
          <tr>
            <th className="px-5 py-4 text-left">STT</th>
            <th className="px-5 py-4 text-left">Tên trường</th>
            <th className="px-5 py-4 text-left">Loại hình</th>
            <th className="px-5 py-4 text-left">Số sinh viên</th>
            <th className="px-5 py-4 text-left">Trạng Thái</th>
            <th className="px-5 py-4 text-left">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="">
          <tr className="bg-[#F7F6FE] ">
            <td className="px-5 py-4">1</td>
            <td className="px-5 py-4">Đại học Quốc Gia Hà Nội</td>
            <td className="px-5 py-4">Công lập</td>
            <td className="px-5 py-4">30000</td>
            <td className="px-5 py-4 text-red-500">
              <Chip label="Hoạt động" sx={{ backgroundColor: '#EBF9F1', color: '#1F9254' }} />
            </td>
            <td className="flex gap-2 px-5 py-4">
              <Link href={'/admin/system/school/detail'}>
                <Tooltip title="Xem chi tiết">
                  <IconButton>
                    <VisibilityIcon color="success" />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Khóa tài khoản">
                <IconButton onClick={() => dispatch(toggleBackdrop())}>
                  <LockIcon color="error" />
                </IconButton>
              </Tooltip>
            </td>
          </tr>
          <tr className="bg-[#F7F6FE]">
            <td className="px-5 py-4">2</td>
            <td className="px-5 py-4">Đại học Bách Khoa Hà Nội</td>
            <td className="px-5 py-4">Công lập</td>
            <td className="px-5 py-4">250000</td>
            <td className="px-5 py-4 text-red-500">
              <Chip label="Tạm ngừng" color="warning" />
            </td>
            <td className="flex gap-2 px-5 py-4">
              <Link href={'/admin/system/school/detail'}>
                <Tooltip title="Xem chi tiết">
                  <IconButton>
                    <VisibilityIcon color="success" />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Khóa tài khoản">
                <IconButton onClick={() => dispatch(toggleBackdrop())}>
                  <LockIcon color="error" />
                </IconButton>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6 text-white">
            <h3 className="font-bold">Khóa tài khoản Trường học</h3>
            <p className="mt-1 text-gray-300">Bạn có chắc chắn muốn khóa tài khoản trường học đại học này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(toggleBackdrop())} />
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
export default AdminSystemSchool;
