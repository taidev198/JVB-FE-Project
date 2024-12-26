import { Checkbox, Chip, TextField } from '@mui/material';
import { debounce } from 'lodash';
import Select from 'react-select';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeAnimated from 'react-select/animated';
import { Button } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import PaginationComponent from '@/components/Common/Pagination';
import { BackDrop } from '@/components/Common/BackDrop';
import { useGetAllWorkShopCompanyQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { statusTextWorkshop } from '@/utils/app/const';
const animatedComponents = makeAnimated();

const WorkShopCompany = () => {
  const dispatch = useDispatch();
  const [selectId, setSelectId] = useState<number | null>(null);
  const backdropType = useAppSelector(state => state.global.backdropType);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [selectedWorkShop, setselectedWorkShop] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);

  const handleAction = (actionType: BackdropType, JobsId: number) => {
    setSelectId(JobsId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );
  const { data: companyWorkShop, isLoading } = useGetAllWorkShopCompanyQuery(
    { page, keyword, size, status, startDate: startDate, endDate: endDate },
    { refetchOnMountOrArgChange: true }
  );
  const handleSelectWorkShop = (id: number) => {
    setselectedWorkShop(prev => (prev.includes(id) ? prev.filter(employeeId => employeeId !== id) : [...prev, id]));
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý yêu cầu workShop</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên...."
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
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACCEPT', label: 'Đã duyệt' },
                { value: 'CANCEL', label: 'Từ chối' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setStatus(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedWorkShop.length === companyWorkShop?.data.content.length}
                  indeterminate={selectedWorkShop.length > 0 && selectedWorkShop.length < (companyWorkShop?.data.content || []).length}
                />
              </th>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tiêu đề</th>
              <th className="px-5 py-4 text-left">Trường học</th>
              <th className="px-5 py-4 text-left">Thời gian bắt đầu</th>
              <th className="px-5 py-4 text-left">Thời gian kết thúc</th>
              <th className="px-5 py-4 text-left">Số lượng công ty ước tính</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {companyWorkShop?.data.content.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="p-3 sm:px-5 sm:py-4">
                  <Checkbox color="primary" checked={selectedWorkShop.includes(item.id)} onChange={() => handleSelectWorkShop(item.id)} />
                </td>
                <td className="px-5 py-4">{index + 1 + (page - 1) * size}</td>
                <td className="px-5 py-4">{item.workshop.workshopTitle}</td>
                <td className="px-5 py-4">{item.workshop.university.universityName}</td>
                <td className="px-5 py-4 text-center">{item.workshop.startTime.split(' ')[0]}</td>
                <td className="px-5 py-4 text-center">{item.workshop.endTime.split(' ')[0]}</td>
                <td className="px-5 py-4 text-center">{item.workshop.estimateCompanyParticipants}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={statusTextWorkshop(item.workshop.moderationStatus).title}
                    style={{
                      color: `${statusTextWorkshop(item.workshop.moderationStatus).color}`,
                      background: `${statusTextWorkshop(item.workshop.moderationStatus).bg}`,
                    }}
                  />
                </td>

                <td className="py-4">
                  <div className="flex items-center justify-center gap-3">
                    {item.workshop.moderationStatus === 'PENDING' && (
                      <>
                        <ButtonReject
                          onClick={() => {
                            handleAction(BackdropType.RefuseConfirmation, item.workshop.id);
                            dispatch(setName(item.workshop.workshopTitle));
                          }}
                        />
                      </>
                    )}

                    {item.workshop.moderationStatus !== 'PENDING' && (
                      <ButtonDelete
                        onClick={() => {
                          handleAction(BackdropType.DeleteConfirmation, item.workshop.id);
                          dispatch(setName(item.workshop.workshopTitle));
                        }}
                      />
                    )}
                  </div>
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
            <h3 className="font-bold">Hủy tham gia hội thảo</h3>
            <p className="mt-1">Bạn có chắc chắn muốn hủy tham gia hội thảo này không?.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-red-800" full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <PaginationComponent
        count={companyWorkShop?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={companyWorkShop?.data.totalElements}
        totalTitle={'workshops'}
      />
    </>
  );
};
export default WorkShopCompany;
