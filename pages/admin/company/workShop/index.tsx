import { Chip, TextField } from '@mui/material';
import { debounce } from 'lodash';
import Select from 'react-select';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import makeAnimated from 'react-select/animated';
import toast from 'react-hot-toast';
import { Button } from '@/components/Common/Button';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import PaginationComponent from '@/components/Common/Pagination';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteWorkShopMutation, useGetAllWorkShopCompanyQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { statusTextWorkShopCompany } from '@/utils/app/const';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';

const animatedComponents = makeAnimated();

const WorkShopCompany = () => {
  const dispatch = useDispatch();
  const [selectId, setSelectId] = useState<number | null>(null);
  const backdropType = useAppSelector(state => state.global.backdropType);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [startDate] = useState<Date | null>(null);
  const [endDate] = useState<Date | null>(null);
  const name = useAppSelector(state => state.global.name);

  const handleAction = (actionType: BackdropType, JobsId: number) => {
    setSelectId(JobsId);
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

  const [deleteOne, { isLoading: isLoadingOne }] = useDeleteWorkShopMutation();
  const handleDelete = async () => {
    try {
      if (selectId) {
        // Điều kiện kiểm tra chỉ liên quan đến `deleteOne`
        await deleteOne({ id: selectId }).unwrap();
        toast.success('WorkShop đã được xóa thành công');
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
        <h1 className="mb-5 font-bold">Quản lý yêu cầu workShop</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tiêu đề"
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
                { value: 'CANCEL', label: 'Hủy chờ' },
                { value: 'REJECT', label: 'Từ chối' },
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
              <th className="p-3 sm:px-3 sm:py-4">STT</th>
              <th className="px-5 py-4 text-left">Tiêu đề</th>
              <th className="px-5 py-4 text-left">Trường học</th>
              <th className="p-3 sm:px-3 sm:py-4">Thời gian bắt đầu</th>
              <th className="p-3 sm:px-3 sm:py-4">Thời gian kết thúc</th>
              <th className="p-3 sm:px-3 sm:py-4">Trạng thái</th>
              <th className="p-3 sm:px-3 sm:py-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {companyWorkShop?.data.content.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                <td className="p-3 text-center sm:px-3 sm:py-4">{index + 1 + (page - 1) * size}</td>
                <td className="px-5 py-4">{item.workshop.workshopTitle}</td>
                <td className="px-5 py-4">{item.workshop.university.universityName}</td>
                <td className="p-3 text-center sm:px-3 sm:py-4">{item.workshop.startTime.split(' ')[0]}</td>
                <td className="p-3 text-center sm:px-3 sm:py-4">{item.workshop.endTime.split(' ')[0]}</td>
                <td className="p-3 text-center sm:px-3 sm:py-4">
                  <Chip
                    label={statusTextWorkShopCompany(item.status).title}
                    style={{
                      color: `${statusTextWorkShopCompany(item.status).color}`,
                      background: `${statusTextWorkShopCompany(item.status).bg}`,
                    }}
                  />
                </td>

                <td className="p-3 text-center sm:px-3 sm:py-4">
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
            ))}
          </tbody>
        </table>
      </div>
      {/* Xóa Khoa */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Hủy tham {name}</h3>
            <p className="mt-1">Bạn có chắc chắn muốn hủy tham gia hội thảo này không?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-green-600" onClick={handleDelete} full={true} />
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
      />
    </>
  );
};
export default WorkShopCompany;
