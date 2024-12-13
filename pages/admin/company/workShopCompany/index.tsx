import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SearchIcon from '@mui/icons-material/Search';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Chip, IconButton, Tooltip, Pagination,FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';

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


const workShopCompany = () => {
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
      workshop_title: 'Workshop A', 
      university_id: 'Trường Đại Học A',
      start_time: '01/12/2024 12:00',
      end_time: '01/12/2024 12:00', 
      address_id: 'Đường Lê Duẩn, Hà Nội', 
      quatity: '15', 
      moderation_status:'đã duyệt' 
    },

    { 
      id: '2', 
      workshop_title: 'Workshop A', 
      university_id: 'Trường Đại Học A',
      start_time: '01/12/2024 12:00',
      end_time: '01/12/2024 12:00', 
      address_id: 'Đường Lê Duẩn, Hà Nội', 
      quatity: '15', 
      moderation_status:'chờ duyệt' 
    },

    { 
      id: '3', 
      workshop_title: 'Workshop A', 
      university_id: 'Trường Đại Học A',
      start_time: '01/12/2024 12:00',
      end_time: '01/12/2024 12:00', 
      address_id: 'Đường Lê Duẩn, Hà Nội', 
      quatity: '15',
      moderation_status:'từ chối' 
    },

    { 
      id: '4', 
      workshop_title: 'Workshop A', 
      university_id: 'Trường Đại Học A',
      start_time: '01/12/2024 12:00',
      end_time: '01/12/2024 12:00', 
      address_id: 'Đường Lê Duẩn, Hà Nội', 
      quatity: '15',
      moderation_status:'đã duyệt' 
    },

    { 
      id: '5', 
      workshop_title: 'Workshop A', 
      university_id: 'Trường Đại Học A',
      start_time: '01/12/2024 12:00',
      end_time: '01/12/2024 12:00', 
      address_id: 'Đường Lê Duẩn, Hà Nội', 
      quatity: '15',
      moderation_status:'từ chối' 
    },
  ];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };


  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý yêu cầu workShop</h1>
        <div className="flex items-center gap-3 justify-between">
        <div className="w-[220px]">
            <Input
              type="text"
              name="search_employee"
              placeholder="Tìm kiếm"
              control={control}
              error={errors.search_employee?.message}
              icon={<SearchIcon />}
            />
          </div>

          {/* <div>
            <MyButton type="submit" text="Tìm kiếm" />
          </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tiêu đề</th>
              <th className="px-5 py-4 text-left">Trường học</th>
              <th className="px-5 py-4 text-left">Thời gian bắt đầu</th>
              <th className="px-5 py-4 text-left">Thời gian kết thúc</th>
              <th className="px-5 py-4 text-left">Địa chỉ</th>
              <th className="px-5 py-4 text-left">Số lượng công ty</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item,index) => (
              <tr key={item.id} className= {index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="px-5 py-4">{item.id}</td>
                <td className="px-5 py-4">{item.workshop_title}</td>
                <td className="px-5 py-4">{item.university_id}</td>
                <td className="px-5 py-4">{item.start_time}</td>
                <td className="px-5 py-4">{item.end_time}</td>
                <td className="px-5 py-4">{item.address_id}</td>
                <td className="px-5 py-4">{item.quatity}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.moderation_status}
                    sx={{
                      // Màu nền dựa trên trạng thái
                      backgroundColor: 
                        item.moderation_status === 'đã duyệt' ? '#EBF9F1' : 
                        item.moderation_status === 'chờ duyệt' ? '#FFFFE0' : 
                        '#FFCDD2',  // Màu nền cho "Từ chối"
                  
                      // Màu chữ dựa trên trạng thái
                      color: 
                        item.moderation_status === 'đã duyệt' ? '#1F9254' :  // Màu chữ xanh cho "Đã duyệt"
                        item.moderation_status === 'chờ duyệt' ? '#FFA726' :  // Màu chữ cam cho "Chờ duyệt"
                        '#D32F2F',  // Màu chữ đỏ cho "Từ chối"

                        paddingLeft: '16px',  // Tăng padding bên trái
                        paddingRight: '16px', // Tăng padding bên phải
                    }}
                  />
                </td>
                <td className="flex gap-2 px-5 py-4">
                  <>
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

      
      {/* {backdropType===BackdropType.General && <BackDrop isCenter={true}><p>hhhhhh</p></BackDrop>} */}
      {backdropType === BackdropType.General && (
        <BackDrop isCenter={true}>
          <div className='relative'>
            <IconButton onClick={() => dispatch(setBackdrop(null))} className="absolute right-0 mr-auto">
              <CloseIcon />
              </IconButton>
          <h1 className="mb-10 mt-3 text-center text-2xl font-bold">Quản lý tài khoản nhân viên </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] py-8 px-20">
        <div className="flex items-center gap-[30px] ">
          <div>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết nhân viên</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <div>
              <span className="mr-2 font-semibold">Mã ngành:</span> #2046
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div>
              <span className="mr-2 font-semibold">Tên nhân viên:</span> MattDickerson
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div>
              <span className="mr-2 font-semibold">Email :</span> Dickerson@gmail.com
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div>
              <span className="mr-2 font-semibold">Ngày đăng kí:</span> 22/05/2022
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <div>
              <span className="mr-2 font-semibold">Vai trò:</span> Quản lý
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> 01234567
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <div>
              <span className="mr-2 font-semibold">Trạng thái:</span> Hoạt động
            </div>
          </li>
        </ul>
      </div>
              </div>
          </BackDrop>
        )}


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

      {/* Hủy yêu cầu tham gia  */}
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
  );
};

export default workShopCompany;