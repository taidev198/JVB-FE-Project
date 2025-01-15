import { Chip, TextField } from '@mui/material';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import toast from 'react-hot-toast';
import { Button } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteWorkShopMutation, useGetAllWorkShopCompanyQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { statusTextWorkShopCompany } from '@/utils/app/const';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import DatePickerComponent from '@/components/Common/DatePicker';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';

const animatedComponents = makeAnimated();

const WorkShopCompany = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [selectId, setSelectId] = useState<number | null>(null);
  const backdropType = useAppSelector(state => state.global.backdropType);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const name = useAppSelector(state => state.global.name);

  const handleAction = (actionType: BackdropType, JobsId: number) => {
    setSelectId(JobsId);
    dispatch(setBackdrop(actionType));
  };

  const [sortState, setSortState] = React.useState({
    currentColumn: null,
    isAsc: null,
  });

  const handleSort = (column: string, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy);
    setSortState({ currentColumn: column, isAsc: isAsc });
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        setSortBy(value);
        dispatch(setPage(1));
      }, 500),
    []
  );
  const { data: companyWorkShop, isLoading } = useGetAllWorkShopCompanyQuery(
    { page, keyword, size, status, startDate: startDate, endDate: endDate, sortBy: sortBy || 'workshopTitle:asc' },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteOne, { isLoading: isLoadingOne }] = useDeleteWorkShopMutation();
  const handleDelete = async () => {
    try {
      if (selectId) {
        // Điều kiện kiểm tra chỉ liên quan đến `deleteOne`
        await deleteOne({ id: selectId }).unwrap();
        toast.success('Hủy tham gia workshop thành công');
      } else {
        toast.error('Không có workShop nào được chọn để xóa');
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
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingOne));
  }, [dispatch, isLoading, isLoadingOne]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý yêu cầu workshop</h1>
        <div className="flex flex-wrap items-center justify-between gap-3 md:mt-0">
          <div className="flex flex-wrap items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tiêu đề"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-full sm:w-auto"
            />

            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACCEPT', label: 'Đã duyệt' },
                { value: 'CANCEL', label: 'Hủy chờ' },
                { value: 'REJECT', label: 'Từ chối' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setStatus(selectedOption.value))}
              className="w-full cursor-pointer sm:w-[160px]"
            />

            <DatePickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">STT</th>
              <th className="pp-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max">Tiêu đề</span>
                  <span>
                    <ButtonUp
                      isSort={sortState.currentColumn === 'workshopTitle' && sortState.isAsc === true}
                      onClick={() => handleSort('workshopTitle', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.currentColumn === 'workshopTitle' && sortState.isAsc === false}
                      onClick={() => handleSort('workshopTitle', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="px-5 py-4 text-left">
                <div className="flex items-center">
                  <span className="min-w-max">Trường học</span>
                  <span>
                    <ButtonUp
                      isSort={sortState.currentColumn === 'universityName' && sortState.isAsc === true}
                      onClick={() => handleSort('universityName', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.currentColumn === 'universityName' && sortState.isAsc === false}
                      onClick={() => handleSort('universityName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="p-3 sm:px-3 sm:py-4">
                <div className="flex items-center">
                  <span className="min-w-max">Thời gian bắt đầu</span>
                  <span>
                    <ButtonUp isSort={sortState.currentColumn === 'startTime' && sortState.isAsc === true} onClick={() => handleSort('startTime', true)} />
                    <ButtonArrow isSort={sortState.currentColumn === 'startTime' && sortState.isAsc === false} onClick={() => handleSort('startTime', false)} />
                  </span>
                </div>
              </th>
              <th className="p-3 sm:px-3 sm:py-4">
                <div className="flex items-center">
                  <span className="min-w-max">Thời gian kết thúc</span>
                  <span>
                    <ButtonUp isSort={sortState.currentColumn === 'endTime' && sortState.isAsc === true} onClick={() => handleSort('endTime', true)} />
                    <ButtonArrow isSort={sortState.currentColumn === 'endTime' && sortState.isAsc === false} onClick={() => handleSort('endTime', false)} />
                  </span>
                </div>
              </th>
              <th className="p-3 sm:px-3 sm:py-4">Trạng thái</th>
              <th className="p-3 sm:px-3 sm:py-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {companyWorkShop?.data.content.length > 0 ? (
              companyWorkShop?.data.content.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                  <td className="px-5 py-4">{index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{item.workshop.workshopTitle}</td>
                  <td className="px-5 py-4">{item.workshop.university.universityName}</td>
                  <td className="px-5 py-4 text-center">{item.workshop.startTime.split(' ')[0]}</td>
                  <td className="px-5 py-4 text-center">{item.workshop.endTime.split(' ')[0]}</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={statusTextWorkShopCompany(item.status).title}
                      style={{
                        color: `${statusTextWorkShopCompany(item.status).color}`,
                        background: `${statusTextWorkShopCompany(item.status).bg}`,
                      }}
                    />
                  </td>

                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ButtonSee
                        onClick={() => {
                          setSelectId(item.workshop.id);
                        }}
                        href={`/portal/workshops/${item.workshop.id}`}
                      />

                      {item.status === 'PENDING' && (
                        <ButtonReject
                          onClick={() => {
                            handleAction(BackdropType.DeleteConfirmation, item.id);
                            dispatch(setName(item.workshop.workshopTitle));
                          }}
                        />
                      )}
                      {item.status === 'ACCEPT' && (
                        <ButtonDelete
                          onClick={() => {
                            handleAction(BackdropType.DeleteConfirmation, item.id);
                            dispatch(setName(item.workshop.workshopTitle));
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
                  <p>Không có dữ liệu nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Xóa Khoa */}
      {backdropType === BackdropType.DeleteConfirmation && <PopupConfirmAction text="Hủy tham gia hội thảo" name={name} onClick={handleDelete} />}

      {/* Pagination */}
      <PaginationComponent
        count={companyWorkShop?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={companyWorkShop?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};
export default WorkShopCompany;
