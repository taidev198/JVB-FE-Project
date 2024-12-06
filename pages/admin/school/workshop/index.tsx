import Link from 'next/link';
import { Chip, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';

import DatePickerComponent from '@/components/Common/DatePicker';
import { formatDate } from '@/utils/app/format';
import { Button } from '@/components/Common/Button';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { useGetAllWorShopsUniversityQuery } from '@/services/adminSchoolApi';

const mockData = [
  {
    id: 1,
    workshopTitle: 'Khóa học ReactJS cơ bản',
    schoolName: 'Trường Đại học Bách Khoa Hà Nội',
    address: 'Hà Nội, Việt Nam',
    startTime: '2024-12-01 09:00',
    endTime: '2024-12-01 17:00',
    estimateCompanyParticipants: 12,
    moderation_status: 'Chờ duyệt',
  },
  {
    id: 2,
    workshopTitle: 'Workshop JavaScript nâng cao',
    schoolName: 'Trường Đại học FPT',
    address: 'Hồ Chí Minh, Việt Nam',
    startTime: '2024-12-05 09:00',
    endTime: '2024-12-05 17:00',
    estimateCompanyParticipants: 20,
    moderation_status: 'Đã duyệt',
  },
  {
    id: 3,
    workshopTitle: 'Khóa học VueJS',
    schoolName: 'Trường Đại học Kinh tế TP.HCM',
    address: 'Đà Nẵng, Việt Nam',
    startTime: '2024-12-10 09:00',
    endTime: '2024-12-10 17:00',
    estimateCompanyParticipants: 8,
    moderation_status: 'Từ chối',
  },
  {
    id: 4,
    workshopTitle: 'Khóa học Node.js cho người mới bắt đầu',
    schoolName: 'Trường Đại học Ngoại Thương',
    address: 'Hà Nội, Việt Nam',
    startTime: '2024-12-15 09:00',
    endTime: '2024-12-15 17:00',
    estimateCompanyParticipants: 15,
    moderation_status: 'Chờ duyệt',
  },
  {
    id: 5,
    workshopTitle: 'Khóa học Angular nâng cao',
    schoolName: 'Trường Đại học Khoa học Tự nhiên',
    address: 'TP.Hồ Chí Minh, Việt Nam',
    startTime: '2024-12-20 09:00',
    endTime: '2024-12-20 17:00',
    estimateCompanyParticipants: 18,
    moderation_status: 'Đã duyệt',
  },
];

const AdminSchoolWorkshop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();

  const { data } = useGetAllWorShopsUniversityQuery();
console.log({data});

  formatDate(startDate);
  formatDate(endDate);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };

  const handleConfirmAction = () => {
    {
      selectId;
    }
  };

  return (
    <div>
      <>
        <div className="rounded-t-md bg-white p-5 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="mb-5 font-bold">Doanh sách Workshop</h1>
            <Link href={'/admin/school/workshop/add-workshop'}>
              <Button text="Thêm" icon={<AddIcon />} />
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-3 md:mt-0">
            <div className="">
              <TextField id="filled-search" label="Nhập tiêu đề" type="search" variant="outlined" size="small" />
            </div>
            <DatePickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
            <thead className="bg-white">
              <tr>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">STT</p>
                </th>
                <th className="px-2 py-4 text-left">Tiêu đề</th>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Trường học</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Địa chỉ</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="w-[100px]">Số lượng công ty ước tính</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Trạng thái</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Hành động</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-4 py-4">
                    <p className="min-w-max">{item.id}</p>
                  </td>
                  <td className="cursor-pointer px-2 py-4 hover:text-primary-main">
                    <Link href={'/admin/school/workshop/detail'}>
                      <p className="sm:[250px] w-[220px]">{item.workshopTitle}</p>
                    </Link>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">{item.schoolName}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">{item.address}</p>
                  </td>
                  <td className="px-2 py-4">{item.estimateCompanyParticipants}</td>
                  <td className="px-2 py-4">
                    <Chip
                      label={item.moderation_status}
                      color={
                        item.moderation_status === 'Đã duyệt'
                          ? 'success'
                          : item.moderation_status === 'Chờ duyệt'
                          ? 'warning'
                          : item.moderation_status === 'Từ chối'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </td>
                  <td className="flex items-center gap-1 py-4">
                    <Tooltip title="Sửa">
                      <Link href={'/admin/school/workshop/update-workshop'}>
                        <IconButton>
                          <EditIcon color="success" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton onClick={() => handleOpenConfirm(item.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
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

        {showBackdrop === BackdropType.DeleteConfirmation && (
          <BackDrop isCenter>
            <div className="max-w-[400px] rounded-md p-6">
              <h3 className="font-bold">Xóa Workshop</h3>
              <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
              <div className="mt-9 flex items-center gap-5">
                <Button text="Hủy" full={true} onClick={() => dispatch(setBackdrop(null))} />
                <Button text="Xác nhận" className="bg-red-800" full={true} onClick={handleConfirmAction} />
              </div>
            </div>
          </BackDrop>
        )}
      </>
    </div>
  );
};
export default AdminSchoolWorkshop;
