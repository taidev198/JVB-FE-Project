import Link from 'next/link';
import { Checkbox, Chip, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import Select from 'react-select';
import DatePickerComponent from '@/components/Common/DatePicker';
import { Button } from '@/components/Common/Button';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useDeleteWorkshopMutation, useGetAllWorShopsUniversityQuery } from '@/services/adminSchoolApi';
import { statusTextWorkshop } from '@/utils/app/const';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonCompanyApply from '@/components/Common/ButtonIcon/ButtonCompany';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';

const AdminSchoolWorkshop = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const [selectedWorkshops, setSelectedWorkshops] = useState<number[]>([]);
  const dispatch = useDispatch();

  const { data: workshops, isLoading } = useGetAllWorShopsUniversityQuery(
    {
      page,
      size,
      keyword,
      startDate: startDate,
      endDate: endDate,
      status,
      sortBy: sortBy || 'workshopTitle:asc',
    },
    { refetchOnMountOrArgChange: true }
  );
  const [sortState, setSortState] = React.useState({
    activeColumn: null,
    isAsc: null,
  });

  const handleSort = (column: String, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy),
      setSortState({
        activeColumn: column,
        isAsc: isAsc,
      });
  };
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allWorkshopIds = workshops?.data.content.map(workshop => workshop.id);
      setSelectedWorkshops(allWorkshopIds ?? []);
    } else {
      setSelectedWorkshops([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedWorkshops(prev => (prev.includes(id) ? prev.filter(workshopId => workshopId !== id) : [...prev, id]));
  };

  const [deleteWorkshop, { isLoading: isLoadingDelete }] = useDeleteWorkshopMutation();

  const handleConfirmAction = async () => {
    try {
      if (selectedWorkshops.length > 0) {
        await deleteWorkshop({ ids: selectedWorkshops }).unwrap();
        toast.success('Workshop đã được xóa thành công.');
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
    dispatch(setLoading(isLoading || isLoadingDelete));
  }, [isLoading, dispatch, isLoadingDelete]);
  return (
    <div>
      <>
        <div className="rounded-t-md bg-white p-5 pb-5">
          <h1 className="mb-5 font-bold">Danh sách workshop</h1>

          <div className="mt-5 flex flex-wrap items-center justify-between md:mt-0">
            <div className="flex flex-wrap items-center gap-3">
              <TextField
                id="filled-search"
                label="Nhập tiêu đề"
                type="search"
                variant="outlined"
                size="small"
                onChange={e => debouncedSearch(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Select
                placeholder="Trạng thái"
                closeMenuOnSelect={true}
                options={[
                  { value: '', label: 'Trạng thái' },
                  { value: 'PENDING', label: 'Đang chờ' },
                  { value: 'APPROVED', label: 'Đã duyệt' },
                  { value: 'REJECTED', label: 'Thôi học' },
                ]}
                onChange={(selectedOption: { value: React.SetStateAction<string> }) => setStatus(selectedOption.value)}
                className="w-[160px] cursor-pointer"
              />
              <DatePickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </div>
            <div className="flex w-full gap-3 md:mt-10 lg:mt-0 lg:w-auto" style={{ marginTop: '10px' }}>
              <Link
                href={'/admin/school/workshop/add-workshop'}
                className="rounded-[8px] border-[1px] bg-[#34a853] px-5 py-2 text-white transition duration-300 hover:bg-[#2e7b42]">
                <AddIcon className="mr-1 h-6 w-6 items-center text-white" />
                Thêm mới
              </Link>
              <Button
                type="submit"
                text="Xóa workshop"
                onClick={() => {
                  dispatch(setName('đã chọn'));
                  dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                }}
                className="bg-red-custom"
                disabled={!selectedWorkshops.length}
              />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white text-[14px]">
            <thead className="bg-white">
              <tr>
                <th className="p-3 sm:px-3 sm:py-4">
                  <Checkbox
                    color="primary"
                    checked={selectedWorkshops.length > 0 && workshops?.data.content.length > 0}
                    indeterminate={selectedWorkshops.length > 0 && setSelectedWorkshops.length < (workshops?.data.content || []).length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </th>
                <th className="px-5 py-4 text-left">
                  <p className="min-w-max">STT</p>
                </th>
                <th className="px-3 text-left sm:px-5">
                  <div className="flex items-center">
                    <span className="min-w-max">Tiêu đề</span>
                    <span>
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
                <th className="px-3 text-left sm:px-5">
                  <div className="flex items-center">
                    <span className="min-w-max">Trường học</span>
                    <span>
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
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Địa chỉ</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="w-[100px]">Thời gian</p>
                </th>
                <th className="px-2 py-4 text-left">
                  <p className="min-w-max">Trạng thái</p>
                </th>
                <th className="px-5 py-4">
                  <p className="min-w-max">Hành động</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {workshops?.data?.content.length > 0 ? (
                workshops?.data?.content.map((workshop, index) => (
                  <tr key={workshop.id} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                    <td className="p-3 text-center sm:px-3 sm:py-4">
                      <Checkbox
                        color="primary"
                        checked={selectedWorkshops.includes(workshop.id)}
                        onChange={() => handleSelectStudent(workshop.id)}
                        size="small"
                      />
                    </td>
                    <td className="p-3 text-center sm:px-5 sm:py-4">
                      <p className="min-w-max">{index + 1 + (page - 1) * size}</p>
                    </td>
                    <td className="px-2 py-4">
                      <p className="sm:[230px] w-[210px]">{workshop.workshopTitle}</p>
                    </td>
                    <td className="px-2 py-4">
                      <p className="sm:[230px] w-[210px]">{workshop.university.universityName}</p>
                    </td>
                    <td className="px-2 py-4">
                      <p className="w-[245px]">
                        {workshop.address?.houseNumber}, {workshop.address?.ward.wardName}, {workshop.address?.district.districtName},
                        {workshop.address?.province.provinceName}
                      </p>
                    </td>
                    <td className="px-2 py-4">{workshop.startTime.split(' ')[0]}</td>
                    <td className="px-3 py-4">
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
                        <ButtonCompanyApply
                          href={`/admin/school/workshop/company-apply-workshop`}
                          onClick={() => {
                            dispatch(setId(workshop.id));
                            dispatch(setName(workshop.workshopTitle));
                          }}
                          title={'Doanh nghiệp tham gia'}
                        />
                        <ButtonSee href={`/admin/school/workshop/${workshop.id}`} onClick={() => dispatch(setId(workshop.id))} />
                        <ButtonUpdate href={`/admin/school/workshop/update/${workshop.id}`} onClick={() => dispatch(setId(workshop.id))} />
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
          count={workshops?.data.totalPages}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          size={size}
          totalItem={workshops?.data.totalElements}
          onSizeChange={value => setSize(value)}
        />

        {showBackdrop === BackdropType.DeleteConfirmation && <PopupConfirmAction text="Xóa workshop đã chọn" name="" onClick={handleConfirmAction} />}
      </>
    </div>
  );
};
export default AdminSchoolWorkshop;
