import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, IconButton, Tooltip, Pagination, TextField } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { useLazyGetAllWorkShopsAdminSystemQuery } from '@/services/adminSystemApi';
import { statusTextWorkshop } from '@/utils/app/const';

const animatedComponents = makeAnimated();

const AdminSystemWorkshop = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);

  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);

  const [fetchWorkshops, { data: workshops, isLoading }] = useLazyGetAllWorkShopsAdminSystemQuery();

  useEffect(() => {
    dispatch(setLoading(isLoading));
    fetchWorkshops({
      page,
      size: 10,
      keyword,
      status,
    });
  }, [page, keyword, status, fetchWorkshops, isLoading, dispatch]);

  const handleAction = (actionType: BackdropType, workshopId: number) => {
    setSelectedWorkshopId(workshopId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
  };

  const handleConfirmAction = async () => {
    if (selectedWorkshopId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.ApproveConfirmation:
            break;
          case BackdropType.RefuseConfirmation:
            break;
          default:
            throw new Error('Invalid action type');
        }
      } catch (error) {
        console.error('Error performing action:', error);
      } finally {
        dispatch(setBackdrop(null));
        setSelectedWorkshopId(null);
        setSelectedAction(null);
      }
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách Workshop</h1>
        <div className="flex items-center gap-3">
          <Select
            placeholder="Trạng thái"
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={[
              { value: '', label: 'Tất cả' },
              { value: 'APPROVED', label: 'Đã duyệt' },
              { value: 'PENDING', label: 'Chờ duyệt' },
              { value: 'REJECTED', label: 'Từ chối' },
            ]}
            onChange={(selectedOption: { value: React.SetStateAction<string> }) => setStatus(selectedOption.value)}
            className="w-[160px] cursor-pointer"
          />
          <TextField id="filled-search" label="Tìm kiếm" type="search" variant="outlined" size="small" onChange={e => debouncedSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
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
            {workshops?.data.content.length !== 0 ? (
              workshops?.data.content.map((workshop, index) => (
                <tr key={workshop.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-4 py-4">
                    <p className="min-w-max">{workshop.id}</p>
                  </td>
                  <Link href={`/admin/system/workshop/${workshop.id}`}>
                    <td className="cursor-pointer px-2 py-4 hover:text-primary-main">
                      <p className="sm:[250px] w-[220px]">{workshop.workshopTitle}</p>
                    </td>
                  </Link>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]"> {workshop.university.universityName}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">
                      {workshop.address.houseNumber}, {workshop.address.ward.wardName}, {workshop.address.district.districtName},
                      {workshop.address.province.provinceName}
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
                    <Tooltip title="Duyệt">
                      <IconButton onClick={() => handleAction(BackdropType.ApproveConfirmation, workshop.id)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Từ chối">
                      <IconButton onClick={() => handleAction(BackdropType.RefuseConfirmation, workshop.id)}>
                        <ClearIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base">
                  <p>Không có dữ liệu workshop nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={workshops?.data.totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        <p className="text-sm">
          ({workshops?.data.currentPage} / {workshops?.data.totalPages})
        </p>
      </div>

      {/*  */}
      {(backdropType === BackdropType.ApproveConfirmation || backdropType === BackdropType.RefuseConfirmation) && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && 'Duyệt WorkShop'}
              {selectedAction === BackdropType.RefuseConfirmation && 'Từ chối WorkShop'}
            </h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}
    </>
  );
};

export default AdminSystemWorkshop;
