import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import SearchIcon from '@mui/icons-material/Search';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Chip, IconButton, Tooltip, Pagination,FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';

import { Button, Button as MyButton } from '@/components/Common/Button';
// import Input from '@/components/Common/Input';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
// import CloseIcon from '@mui/icons-material/Close';
import { debounce } from 'lodash';
import { useGetAllWorkShopCompanyQuery} from '@/services/adminCompanyApi';


interface FormDataRegisterCompany {
  search_employee: string;
}

const validationSchema = Yup.object({
  search_employee: Yup.string().required('Tên doanh nghiệp không được bỏ trống').max(100, 'Tên doanh nghiệp không được quá 100 kí tự'),
});


const workShopCompany = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
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

    const debouncedSearch = debounce((value: string) => {
      setKeyword(value);
    }, 500);

    const {data: companyWorkShop, isLoading} = useGetAllWorkShopCompanyQuery({
      page,
      size: 10,
      keyword,
      status,
    },{ refetchOnMountOrArgChange: true })
    console.log('companyWorkShop: ', companyWorkShop);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
      setPage(page);
    };
  
    console.log(companyWorkShop)


  // Data giả lập
  // const mockData = [
  //   { 
  //     id: '1', 
  //     workshop_title: 'Workshop A', 
  //     university_id: 'Trường Đại Học A',
  //     start_time: '01/12/2024 12:00',
  //     end_time: '01/12/2024 12:00', 
  //     address_id: 'Đường Lê Duẩn, Hà Nội', 
  //     quatity: '15', 
  //     moderation_status:'đã duyệt' 
  //   },

  //   { 
  //     id: '2', 
  //     workshop_title: 'Workshop A', 
  //     university_id: 'Trường Đại Học A',
  //     start_time: '01/12/2024 12:00',
  //     end_time: '01/12/2024 12:00', 
  //     address_id: 'Đường Lê Duẩn, Hà Nội', 
  //     quatity: '15', 
  //     moderation_status:'chờ duyệt' 
  //   },

  //   { 
  //     id: '3', 
  //     workshop_title: 'Workshop A', 
  //     university_id: 'Trường Đại Học A',
  //     start_time: '01/12/2024 12:00',
  //     end_time: '01/12/2024 12:00', 
  //     address_id: 'Đường Lê Duẩn, Hà Nội', 
  //     quatity: '15',
  //     moderation_status:'từ chối' 
  //   },

  //   { 
  //     id: '4', 
  //     workshop_title: 'Workshop A', 
  //     university_id: 'Trường Đại Học A',
  //     start_time: '01/12/2024 12:00',
  //     end_time: '01/12/2024 12:00', 
  //     address_id: 'Đường Lê Duẩn, Hà Nội', 
  //     quatity: '15',
  //     moderation_status:'đã duyệt' 
  //   },

  //   { 
  //     id: '5', 
  //     workshop_title: 'Workshop A', 
  //     university_id: 'Trường Đại Học A',
  //     start_time: '01/12/2024 12:00',
  //     end_time: '01/12/2024 12:00', 
  //     address_id: 'Đường Lê Duẩn, Hà Nội', 
  //     quatity: '15',
  //     moderation_status:'từ chối' 
  //   },
  // ];


  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý yêu cầu workShop</h1>
        <div className="flex items-center gap-3 justify-between">
        <div className="w-[220px]">
             <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
          </div>
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
            {companyWorkShop?.data.content.map((item, index) => (
              <tr key={item.id} className= {index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="px-5 py-4">{index + 1}</td>
                <td className="px-5 py-4">{item.workshop.workshopTitle}</td>
                <td className="px-5 py-4">{item.workshop.university.universityName}</td>
                <td className="px-5 py-4">{item.workshop.startTime}</td>
                <td className="px-5 py-4">{item.workshop.endTime}</td>
                <td className="px-5 py-4">{item.workshop.address.houseNumber}-{item.workshop.address.ward.id} - {item.workshop.address.district.id} - {item.workshop.address.province.id}</td>
                <td className="px-5 py-4">{item.workshop.estimateCompanyParticipants}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={item.workshop.moderationStatus}
                    sx={{
                      // Màu nền dựa trên trạng thái
                      backgroundColor: 
                        item.workshop.moderationStatus === 'REJECTED' ? '#EBF9F1' : 
                        item.workshop.moderationStatus === 'APPROVED' ? '#FFFFE0' : 
                        '#FFCDD2',  
                  
                      // Màu chữ dựa trên trạng thái
                      color: 
                        item.workshop.moderationStatus === 'REJECTED' ? '#1F9254' :  // Màu chữ xanh cho "Đã duyệt"
                        item.workshop.moderationStatus === 'APPROVED' ? '#FFA726' :  // Màu chữ cam cho "Chờ duyệt"
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


      {/* Pagination */}
      <div className="flex justify-center bg-white p-5">
        <Pagination count={3} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
      </div>

    </>
  );
};

export default workShopCompany;