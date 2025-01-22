import toast from 'react-hot-toast';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, Chip, TextField, Tooltip } from '@mui/material';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import debounce from 'lodash.debounce';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { Button } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import {
  useApproveWorkshopMutation,
  useDeleteOneWorkshopMutation,
  useDeleteWorkshopsMutation,
  useGetAllWorkShopsAdminSystemQuery,
  useRejectWorkshopMutation,
} from '@/services/adminSystemApi';
import { statusTextWorkshop } from '@/utils/app/const';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import DatePickerComponent from '@/components/Common/DatePicker';

const animatedComponents = makeAnimated();

const AdminSystemWorkshop = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<number[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedWorkshop, setSelectedWorkshop] = useState<number[]>([]);
  const dispatch = useDispatch();

  const name = useAppSelector(state => state.global.name);

  const [sortState, setSortState] = React.useState({
    activeColumn: null,
    isAsc: null,
  });

  const handleSort = (column: String, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy);
    setSortState({
      activeColumn: column,
      isAsc: isAsc,
    });
  };
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setSortBy(value);
        setPage(1);
      }, 500),
    []
  );

  const { data: workshops, isLoading } = useGetAllWorkShopsAdminSystemQuery(
    {
      page,
      size,
      keyword,
      status,
      startDate: startDate,
      endDate: endDate,
      sortBy: sortBy || 'workshopTitle:asc',
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleAction = (actionType: BackdropType, workshopId: number) => {
    setSelectedWorkshopId(workshopId);
    setSelectedAction(actionType);
    setSelectId(selectId);
    dispatch(setBackdrop(actionType));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allWorkshopsIds = workshops?.data.content.map(workshop => workshop.id);
      setSelectedWorkshop(allWorkshopsIds ?? []);
    } else {
      setSelectedWorkshop([]);
    }
  };

  const handleSelectWorkshops = (id: number) => {
    setSelectedWorkshop(prev => (prev.includes(id) ? prev.filter(workshopId => workshopId !== id) : [...prev, id]));
  };

  const [approveWorkshop, { isLoading: isLoadingApprove }] = useApproveWorkshopMutation();
  const [deleteOne, { isLoading: isLoadingDeleteOne }] = useDeleteOneWorkshopMutation();
  const [rejectWorkshop, { isLoading: isLoadingReject }] = useRejectWorkshopMutation();
  const [deleteWorkshops] = useDeleteWorkshopsMutation();
  const handleConfirmAction = async () => {
    if (selectedAction) {
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
            if (selectedWorkshop.length > 0) {
              await deleteWorkshops({ ids: selectedWorkshop }).unwrap();
              setSelectedWorkshop([]);
              toast.success('Xóa workshop thành công');
            } else {
              await deleteOne({ ids: selectId }).unwrap();
              setSelectId([]);
              toast.success('Xóa workshop thành công');
            }
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
    dispatch(setLoading(isLoading || isLoadingApprove || isLoadingReject || isLoadingDeleteOne));
  }, [dispatch, isLoading, isLoadingApprove, isLoadingReject, isLoadingDeleteOne]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách workshops</h1>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5">
            <TextField
              id="filled-search"
              label="Tìm kiếm tiêu đề, trường học"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
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
            <DatePickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          </div>
          <Button
            type="submit"
            text="Xóa workshops"
            onClick={() => {
              handleAction(BackdropType.DeleteConfirmation, null);
              dispatch(setName('đã chọn'));
            }}
            className="bg-red-custom"
            disabled={!selectedWorkshop.length}
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 px-1 text-left sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedWorkshop.length > 0 && selectedWorkshop.length === workshops?.data.content.length}
                  indeterminate={selectedWorkshop.length > 0 && selectedWorkshop.length < (workshops?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              <th className="px-1 py-4">STT</th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('workshopTitle', !(sortState.activeColumn === 'workshopTitle' && sortState.isAsc))}>
                    Tiêu đề workshop
                  </span>
                  <span className="">
                    <ButtonUp
                      isSort={sortState.activeColumn === 'workshopTitle' && sortState.isAsc === true}
                      onClick={() => handleSort('workshopTitle', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'workshopTitle' && sortState.isAsc === false}
                      onClick={() => handleSort('workshopTitle', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span
                    className="min-w-max"
                    onClick={() => handleSort('university.universityName', !(sortState.activeColumn === 'university.universityName' && sortState.isAsc))}>
                    Trường học
                  </span>
                  <span className="">
                    <ButtonUp
                      isSort={sortState.activeColumn === 'university.universityName' && sortState.isAsc === true}
                      onClick={() => handleSort('university.universityName', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'university.universityName' && sortState.isAsc === false}
                      onClick={() => handleSort('university.universityName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('startTime', !(sortState.activeColumn === 'startTime' && sortState.isAsc))}>
                    Thời gian bắt đầu
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'startTime' && sortState.isAsc === true} onClick={() => handleSort('startTime', true)} />
                    <ButtonArrow isSort={sortState.activeColumn === 'startTime' && sortState.isAsc === false} onClick={() => handleSort('startTime', false)} />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('endTime', !(sortState.activeColumn === 'endTime' && sortState.isAsc))}>
                    Thời gian kết thúc
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'endTime' && sortState.isAsc === true} onClick={() => handleSort('endTime', true)} />
                    <ButtonArrow isSort={sortState.activeColumn === 'endTime' && sortState.isAsc === false} onClick={() => handleSort('endTime', false)} />
                  </span>
                </div>
              </th>
              <th className="px-2 py-4">
                <p className="min-w-max">Trạng thái</p>
              </th>
              <th className="px-5 py-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {workshops?.data.content.length !== 0 ? (
              workshops?.data.content.map((workshop, index) => (
                <tr key={workshop.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 px-1 sm:py-4">
                    <Checkbox
                      color="primary"
                      checked={selectedWorkshop.includes(workshop.id)}
                      onChange={() => handleSelectWorkshops(workshop.id)}
                      size="small"
                    />
                  </td>
                  <td className="px-1 py-4 text-center">{index + 1 + (page - 1) * size}</td>
                  <td className="w-[200px] px-5 py-4 text-center">
                    <Tooltip title={workshop.workshopTitle} placement="bottom" arrow>
                      <span
                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          maxWidth: '50px',
                        }}>
                        {workshop.workshopTitle}
                      </span>
                    </Tooltip>
                  </td>

                  <td className="px-2 py-4">
                    <p className="w-[180px]"> {workshop.university.universityName}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="text-center">{workshop.startTime.split(' ')[0]}</p>
                  </td>
                  <td className="px-2 py-4">
                    <p className="text-center">{workshop.endTime.split(' ')[0]}</p>
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
                    <div className="flex items-center gap-2">
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

                      <ButtonDelete
                        onClick={() => {
                          handleAction(BackdropType.DeleteConfirmation, null);
                          dispatch(setId(workshop.id));
                          dispatch(setName(workshop.workshopTitle));
                        }}
                      />
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
      {showBackdrop === BackdropType.DeleteConfirmation && (
        <PopupConfirmAction text="Bạn có chắc chắn muốn xóa" name={`${name} này không?`} onClick={handleConfirmAction} />
      )}

      {/* Pagination */}
      <PaginationComponent
        size={size}
        page={page}
        count={workshops?.data.totalPages}
        onPageChange={(event, value) => setPage(value)}
        totalItem={workshops?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};

export default AdminSystemWorkshop;
