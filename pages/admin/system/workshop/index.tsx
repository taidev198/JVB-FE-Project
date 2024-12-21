import toast from 'react-hot-toast';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, TextField } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import debounce from 'lodash.debounce';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import {
  useApproveWorkshopMutation,
  useDeleteWorkshopMutation,
  useGetAllWorkShopsAdminSystemQuery,
  useRejectWorkshopMutation,
} from '@/services/adminSystemApi';
import { statusTextWorkshop } from '@/utils/app/const';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';

const animatedComponents = makeAnimated();

const AdminSystemWorkshop = () => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: workshops, isLoading } = useGetAllWorkShopsAdminSystemQuery(
    {
      page,
      size,
      keyword,
      status,
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleAction = (actionType: BackdropType, workshopId: number) => {
    setSelectedWorkshopId(workshopId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
  };

  const [approveWorkshop, { isLoading: isLoadingApprove }] = useApproveWorkshopMutation();
  const [rejectWorkshop, { isLoading: isLoadingReject }] = useRejectWorkshopMutation();
  const [deleteWorkshop, { isLoading: isLoadingDelete }] = useDeleteWorkshopMutation();

  const handleConfirmAction = async () => {
    if (selectedWorkshopId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.ApproveConfirmation: {
            await approveWorkshop({ id: selectedWorkshopId }).unwrap();
            toast.success('Workshop đã được phê duyệt thành công!');
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await rejectWorkshop({ id: selectedWorkshopId }).unwrap();
            toast.success('Workshop đã bị từ chối phê duyệt.');
            break;
          }
          case BackdropType.DeleteConfirmation: {
            await deleteWorkshop({ id: selectedWorkshopId }).unwrap();
            toast.success('Workshop đã được xóa thành công!');
            break;
          }
          default:
            throw new Error('Invalid action type');
        }
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
          toast.error(errMsg);
        } else if (isErrorWithMessage(error)) {
          toast.error(error.message);
        }
      } finally {
        dispatch(setBackdrop(null));
        setSelectedWorkshopId(null);
        setSelectedAction(null);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingApprove || isLoadingReject || isLoadingDelete));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoading, isLoadingApprove, isLoadingReject, isLoadingDelete]);

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
            onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setStatus(selectedOption.value))}
            className="w-[160px] cursor-pointer"
          />
          <TextField
            id="filled-search"
            label="Tìm kiếm tiêu đề, tên trường"
            type="search"
            variant="outlined"
            size="small"
            onChange={e => debouncedSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4">STT</th>
              <th className="px-2 py-4 text-left">Tiêu đề</th>
              <th className="px-2 py-4 text-left">
                <p className="min-w-max">Trường học</p>
              </th>
              <th className="px-2 py-4 text-left">
                <p className="min-w-max">Địa chỉ</p>
              </th>
              <th className="px-2 py-4 text-left">
                <p className="min-w-max">Trạng thái</p>
              </th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {workshops?.data.content.length !== 0 ? (
              workshops?.data.content.map((workshop, index) => (
                <tr key={workshop.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4 text-center">{index + 1 + (page - 1) * size}</td>
                  <td className="cursor-pointer px-2 py-4">
                    <p className="sm:[250px] w-[220px]">{workshop.workshopTitle}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]"> {workshop.university.universityName}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="sm:[250px] w-[220px]">
                      {workshop.address.houseNumber}, {workshop.address.ward.wardName}, {workshop.address.district.districtName},
                      {workshop.address.province.provinceName}
                    </p>
                  </td>
                  <td className="px-2 py-4">
                    <Chip
                      label={statusTextWorkshop(workshop.moderationStatus).title}
                      style={{
                        color: `${statusTextWorkshop(workshop.moderationStatus).color}`,
                        background: `${statusTextWorkshop(workshop.moderationStatus).bg}`,
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <ButtonSee href={`/admin/system/workshop/${workshop.id}`} onClick={() => dispatch(setId(workshop.id))} />
                      {workshop.moderationStatus === 'PENDING' && (
                        <>
                          <ButtonAccept
                            onClick={() => {
                              handleAction(BackdropType.ApproveConfirmation, workshop.id);
                              dispatch(setName(workshop.workshopTitle));
                            }}></ButtonAccept>

                          <ButtonReject
                            onClick={() => {
                              handleAction(BackdropType.RefuseConfirmation, workshop.id);
                              dispatch(setName(workshop.workshopTitle));
                            }}
                          />
                        </>
                      )}

                      {workshop.moderationStatus !== 'PENDING' && (
                        <ButtonDelete
                          onClick={() => {
                            handleAction(BackdropType.DeleteConfirmation, workshop.id);
                            dispatch(setName(workshop.workshopTitle));
                          }}
                        />
                      )}
                    </div>
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
      <PaginationComponent
        size={size}
        page={page}
        count={workshops?.data.totalPages}
        onPageChange={(event, value) => dispatch(setPage(value))}
        totalItem={workshops?.data.totalElements}
        totalTitle={'tài khoản'}
      />
      {/* Backdrops */}
      {(backdropType === BackdropType.ApproveConfirmation ||
        backdropType === BackdropType.RefuseConfirmation ||
        backdropType === BackdropType.DeleteConfirmation) && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && `Duyệt workshop ${name}`}
              {selectedAction === BackdropType.RefuseConfirmation && `Từ chối workshop ${name}`}
              {selectedAction === BackdropType.DeleteConfirmation && `Xóa workshop ${name}`}
            </h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}
    </>
  );
};

export default AdminSystemWorkshop;
