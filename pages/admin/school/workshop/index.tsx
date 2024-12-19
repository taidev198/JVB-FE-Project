import Link from 'next/link';
import { Chip, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import DatePickerComponent from '@/components/Common/DatePicker';
import { Button } from '@/components/Common/Button';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteWorkshopMutation, useGetAllWorShopsUniversityQuery } from '@/services/adminSchoolApi';
import { statusTextWorkshop } from '@/utils/app/const';
import { setToast } from '@/store/slices/toastSlice';

const AdminSchoolWorkshop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const dispatch = useDispatch();

  const { data: workshops, isLoading } = useGetAllWorShopsUniversityQuery({
    page: currentPage,
    size: 10,
    keyword,
    startDate: startDate,
    endDate: endDate,
  });

  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleOpenConfirm = (id: number) => {
    setSelectId(id);
    dispatch(setBackdrop(BackdropType.DeleteConfirmation));
  };

  const [deleteWorkshop, { isLoading: isLoadingDelete, isSuccess, data }] = useDeleteWorkshopMutation();
  const handleConfirmAction = () => {
    deleteWorkshop({ id: selectId });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToast({ message: data?.message }));
      dispatch(setBackdrop(null));
    }
    dispatch(setLoading(isLoading || isLoadingDelete));
  }, [isLoading, dispatch, isLoadingDelete, data?.message, isSuccess]);
  return (
    <div>
      <>
        <div className="rounded-t-md bg-white p-5 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="mb-5 font-bold">Doanh sách Workshop</h1>
            <Link href={'/admin/school/workshop/add-workshop'}>
              <Button text="Thêm mới" icon={<AddIcon />} />
            </Link>
          </div>
          <div className="mt-5 flex items-center gap-3 md:mt-0">
            <div className="">
              <TextField
                id="filled-search"
                label="Nhập tiêu đề"
                type="search"
                variant="outlined"
                size="small"
                onChange={e => debouncedSearch(e.target.value)}
              />
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
              {workshops?.data?.content.map((workshop, index) => (
                <tr key={workshop.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-4 py-4">
                    <p className="min-w-max">{workshop.id}</p>
                  </td>
                  <td className="cursor-pointer px-2 py-4 hover:text-primary-main">
                    <Link href={`/admin/school/workshop/${workshop.id}`} onClick={() => dispatch(setId(workshop.id))}>
                      <p className="sm:[250px] w-[220px]">{workshop.workshopTitle}</p>
                    </Link>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">{workshop.university.universityName}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">
                      {workshop.address?.houseNumber}, {workshop.address?.ward.wardName}, {workshop.address?.district.districtName},
                      {workshop.address?.province.provinceName}
                    </p>
                  </td>
                  <td className="px-2 py-4">{workshop.estimateCompanyParticipants}</td>
                  <td className="px-2 py-4">
                    <Chip
                      label={statusTextWorkshop(workshop.moderationStatus)}
                      color={
                        workshop.moderationStatus === 'APPROVED'
                          ? 'success'
                          : workshop.moderationStatus === 'PENDING'
                          ? 'warning'
                          : workshop.moderationStatus === 'REJECTED'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </td>
                  <td className="flex items-center gap-1 py-4">
                    <Tooltip title="Sửa">
                      <Link href={`/admin/school/workshop/update/${workshop.id}`} onClick={() => dispatch(setId(workshop.id))}>
                        <IconButton>
                          <EditIcon color="success" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        onClick={() => {
                          handleOpenConfirm(workshop.id);
                          dispatch(setName(workshop.workshopTitle));
                        }}>
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
        <div className="flex items-center justify-center bg-white p-5">
          <Pagination count={workshops?.data.totalPages} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
          <p className="text-sm">
            ({workshops?.data.currentPage} / {workshops?.data.totalPages})
          </p>
        </div>

        {showBackdrop === BackdropType.DeleteConfirmation && (
          <BackDrop isCenter>
            <div className="max-w-[400px] rounded-md p-6">
              <h3 className="font-bold">Xóa workshop {name}</h3>
              <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
              <div className="mt-9 flex items-center gap-5">
                <Button text="Hủy" className="bg-red-700" full={true} onClick={() => dispatch(setBackdrop(null))} />
                <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
              </div>
            </div>
          </BackDrop>
        )}
      </>
    </div>
  );
};
export default AdminSchoolWorkshop;
