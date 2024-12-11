import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Chip, IconButton, Tooltip, Pagination,FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import Link from 'next/link';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
// import BorderColorIcon from '@mui/icons-material/BorderColor';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Button as MyButton } from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import CloseIcon from '@mui/icons-material/Close';


interface FormDataRegisterCompany {
  search_employee: string;
}

const validationSchema = Yup.object({
  search_employee: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});


const requestListCompany = () => {
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
      company_name: 'Workshop A', 
      job_title: 'Trường Đại Học A',
      job_status: 'Đang chờ',
      expiration_date: '01/12/2024 12:00', 
    },

    { 
      id: '2', 
      company_name: 'Workshop A', 
      job_title: 'Trường Đại Học A',
      job_status: 'Đang chờ',
      expiration_date: '01/12/2024 12:00', 
    },

    { 
      id: '3', 
      company_name: 'Workshop A', 
      job_title: 'Trường Đại Học A',
      job_status: 'Đang chờ',
      expiration_date: '01/12/2024 12:00', 
    },

    { 
      id: '4', 
      company_name: 'Workshop A', 
      job_title: 'Trường Đại Học A',
      job_status: 'Đang chờ',
      expiration_date: '01/12/2024 12:00', 
    },

    { 
      id: '5', 
      company_name: 'Workshop A', 
      job_title: 'Trường Đại Học A',
      job_status: 'Đang chờ',
      expiration_date: '01/12/2024 12:00', 
    },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };


  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý yêu cầu đăng bài tuyển dụng</h1>
        <div className="flex items-center gap-3 justify-between">
        <div className="w-[220px]">
            <Input
              type="text"
              name="search_employee"
              placeholder="Tìm kiếm theo công ty hoặc vị trí"
              control={control}
              error={errors.search_employee?.message}
              icon={<SearchIcon />}
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">Công Ty</th>
              <th className="px-5 py-4 text-left">Vị trí tuyển dụng</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Ngày yêu cầu</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item,index) => (
              <tr key={item.company_name} className= {index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                {/* <td className="px-5 py-4">{item.id}</td> */}
                <td className="px-5 py-4">{item.company_name}</td>
                <td className="px-5 py-4">{item.job_title}</td>
                <td className="px-5 py-4">
                    <Chip
                      label={item.job_status}
                      color={
                        item.job_status === 'Đã duyệt'
                          ? 'success'
                          : item.job_status === 'Chờ duyệt'
                          ? 'warning'
                          : item.job_status === 'Từ chối'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </td>
                <td className="px-5 py-4">{item.expiration_date}</td>

                <td className="flex gap-2 px-5 py-4">
                  <>
                    <Tooltip title="Xem chi tiết">
                      <IconButton onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}>
                        <VisibilityIcon color="success" />
                      </IconButton>
                    </Tooltip>

                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Hủy yêu cầu tham gia  */}
      {backdropType === BackdropType.DeleteConfirmation && (
             <BackDrop isCenter={true}>
             <div className="max-w-[700px] rounded-md p-6">
              <h1 className="font-bold text-3xl">Danh sách yêu cầu đăng bài tuyển dụng</h1>
              <div className='border border-gray-400 mt-7 rounded-md'>
                <div className='p-4'>
                  <h2 className="font-bold">Tên doanh nghiệp: Công ty ABC</h2>
                  <p className="mt-1">Nội dung: Tuyển dụng nhân viên lập trình web, yêu cầu kinh nghiệm 2 năm.</p>
                  <div className="mt-6 flex items-center gap-5">
                    <Button text="Duyệt" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
                    <Button text="Từ chối" className="bg-red-600" full={true} />
                  </div>
                </div>
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
}

export default requestListCompany