import Link from 'next/link';
import { Chip, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import DatePickerComponent from '@/components/Common/DatePicker';
import { Button } from '@/components/Common/Button';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteWorkshopMutation, useGetAllWorShopsUniversityQuery } from '@/services/adminSchoolApi';
import { statusTextWorkshop } from '@/utils/app/const';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';

import { setToast } from '@/store/slices/toastSlice';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonCompanyApply from '@/components/Common/ButtonIcon/ButtonCompany';

const AdminSchoolWorkshop = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectId, setSelectId] = useState<number | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size } = useAppSelector(state => state.filter);
  const dispatch = useDispatch();

  const { data: workshops, isLoading } = useGetAllWorShopsUniversityQuery(
    {
      page: page,
      size: size,
      keyword,
      startDate: startDate,
      endDate: endDate,
    },
    { refetchOnMountOrArgChange: true }
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

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
    return () => {
      dispatch(resetFilters());
    };
  }, [isLoading, dispatch, isLoadingDelete, data?.message, isSuccess]);
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

              <DatePickerComponent startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
            </div>
            <div className="mt-3 w-full lg:mt-0 lg:w-auto">
              <Link href={'/admin/school/workshop/add-workshop'}>
                <Button text="Thêm mới" icon={<AddIcon />} full={true} />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white text-[14px]">
            <thead className="bg-white">
              <tr>
                <th className="px-5 py-4 text-left">
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
                    <td className="px-2 py-4">{workshop.startTime}</td>
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
                        <ButtonDelete
                          onClick={() => {
                            handleOpenConfirm(workshop.id);
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

        {/* Pagination */}
        <PaginationComponent
          count={workshops?.data.totalPages}
          page={page}
          onPageChange={(event, value) => dispatch(setPage(value))}
          size={size}
          totalItem={workshops?.data.totalElements}
        />

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
