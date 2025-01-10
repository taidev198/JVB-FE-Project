import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import toast from 'react-hot-toast';
import makeAnimated from 'react-select/animated';
import { debounce } from 'lodash';
import { Chip, TextField } from '@mui/material';
import { useDeleteWorkShopMutation, useGetAllWorkShopCompanyQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { statusTextWorkShopCompany } from '@/utils/app/const';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
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
        setKeyword(value);
        setPage(1);
      }, 500),
    []
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
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setStatus(selectedOption.value)}
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
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tiêu đề</th>
              <th className="px-5 py-4 text-left">Trường học</th>
              <th className="px-5 py-4 text-left">Thời gian bắt đầu</th>
              <th className="px-5 py-4 text-left">Thời gian kết thúc</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
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
