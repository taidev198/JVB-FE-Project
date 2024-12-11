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

import { Button, Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';



interface FormDataRegisterCompany {
  search_employee: string;
}

const validationSchema = Yup.object({
  search_employee: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});

const jobCompany = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterCompany>({
    resolver: yupResolver(validationSchema),
  });


  // Data giả lập
  const mockData = [
    { 
        id: '1', 
        job_title: 'Kỹ sư phần mềm', 
        company_description: 'Phát triển ứng dụng web và mobile', 
        salary_range: '20.000.000đ - 30.000.000đ', 
        expiration_date: '20-11-2024', 
    },

    { 
        id: '2', 
        job_title: 'Kỹ sư phần mềm', 
        company_description: 'Phát triển ứng dụng web và mobile', 
        salary_range: '20.000.000đ - 30.000.000đ', 
        expiration_date: '20-11-2024', 
    },

    { 
        id: '3', 
        job_title: 'Kỹ sư phần mềm', 
        company_description: 'Phát triển ứng dụng web và mobile', 
        salary_range: '20.000.000đ - 30.000.000đ', 
        expiration_date: '20-11-2024', 
    },

    { 
        id: '4', 
        job_title: 'Kỹ sư phần mềm', 
        company_description: 'Phát triển ứng dụng web và mobile', 
        salary_range: '20.000.000đ - 30.000.000đ', 
        expiration_date: '20-11-2024', 
    },

    { 
        id: '5', 
        job_title: 'Kỹ sư phần mềm', 
        company_description: 'Phát triển ứng dụng web và mobile', 
        salary_range: '20.000.000đ - 30.000.000đ', 
        expiration_date: '20-11-2024', 
    },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };


  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách bài đăng tuyển</h1>
        <div className="flex items-center gap-3 justify-between ">
          <div className="w-[200px]">
            <Input
              type="text"
              name="search_employee"
              placeholder="Tìm kiếm"
              control={control}
              error={errors.search_employee?.message}
              icon={<SearchIcon />}
            />
          </div>
          <MyButton type="submit" text="Thêm công việc" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên công việc</th>
              <th className="px-5 py-4 text-left">Mô tả</th>
              <th className="px-5 py-4 text-left">Mức lương</th>
              <th className="px-5 py-4 text-left">Thời hạn</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr key={item.id} className= {index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="px-5 py-4">{item.id}</td>
                <td className="px-5 py-4">{item.job_title}</td>
                <td className="px-5 py-4">{item.company_description}</td>
                <td className="px-5 py-4">{item.salary_range}</td>
                <td className="px-5 py-4">{item.expiration_date}</td>

                <td className="flex gap-2 px-5 py-4">
                  <>
                    <Link href={'/admin/company/jobCompany/detailJobCompany'}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton>
                        <VisibilityIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    </Link>

                    <Tooltip title="Sửa">
                      <IconButton>
                        <BorderColorIcon className='text-purple-500' />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>

                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


        {/* Xóa Nhân Viên */}
        {backdropType === BackdropType.DeleteConfirmation && (
          <BackDrop isCenter={true}>
           <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sinh viên khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-600" full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>
    </>
  )
}

export default jobCompany