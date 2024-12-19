import React, { useEffect, useMemo } from 'react';
import { Chip, IconButton, Pagination, TextField, Tooltip } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { useGetAllJobAppliesUniversityQuery } from '@/services/adminSchoolApi';
import { jobType, StatusJob } from '@/utils/app/const';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';

const Partnerships = () => {
  const dispatch = useDispatch();
  const { page, size } = useAppSelector(state => state.filter);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const universityId = useAppSelector(state => state.user?.user?.id);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: jobs, isLoading: isLoadingGetAll } = useGetAllJobAppliesUniversityQuery({ page, size, universityId });
  const handleConfirmAction = () => {};
  useEffect(() => {
    dispatch(setLoading(isLoadingGetAll));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingGetAll]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách công việc đã ứng tuyển</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'BAN', label: 'Ngưng hoạt động' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setStatus(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
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
              <th className="px-5 py-4 text-left">Tên Công Ty</th>
              <th className="px-5 py-4 text-left">Tên công việc</th>
              <th className="px-5 py-4 text-left">Loại hình</th>
              <th className="px-5 py-4 text-left">Yêu cầu trình độ</th>
              <th className="px-5 py-4 text-left">Ngày ứng tuyển</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.data.content.length !== 0 ? (
              jobs?.data.content.map((job, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{job.company.companyName}</td>
                  <td className="px-5 py-4">{job.job.jobTitle}</td>
                  <td className="px-5 py-4">{jobType(job.job.jobType)}</td>
                  <td className="px-5 py-4">{job.job.jobLevel.charAt(0).toUpperCase() + job.job.jobLevel.slice(1).toLowerCase()}</td>
                  <td className="px-5 py-4">17/12/2024</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={StatusJob(job.status).title}
                      style={{ color: `${StatusJob(job.status).color}`, backgroundColor: `${StatusJob(job.status).bg}` }}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Tooltip title="Hủy ứng tuyển">
                      <IconButton
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setName(job.job.jobTitle));
                        }}>
                        <CancelIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-red-500">
                  <p>Không có công việc đã ứng tuyển nào.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={jobs?.data.totalPages} page={page} onChange={(event, value) => dispatch(setPage(value))} color="primary" shape="rounded" />
        <p className="text-sm">
          ({jobs?.data.currentPage} / {jobs?.data.totalPages})
        </p>
      </div>
      {showBackdrop === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Hủy ứng tuyển {name}</h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-700" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmAction} />
            </div>
          </div>
        </BackDrop>
      )}
    </>
  );
};

export default Partnerships;
