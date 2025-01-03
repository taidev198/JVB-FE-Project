import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import makeAnimated from 'react-select/animated';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { useCancelJobsMutation, useDeleteJobsMutation, useGetAllJobAppliesUniversityQuery, useGetAllMajorsQuery } from '@/services/adminSchoolApi';
import { jobType, statusTextJob } from '@/utils/app/const';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
const animatedComponents = makeAnimated();
const Partnerships = () => {
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const universityId = useAppSelector(state => state.user?.id);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [selectedJobsId, setSelectedJobsId] = useState<number | null>(null);
  const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
  const [major, setMajor] = useState<number | null>(null);
  const { data: dataMajor } = useGetAllMajorsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [deletedJobs] = useState([]);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );
  const { data: jobs, isLoading: isLoadingGetAll } = useGetAllJobAppliesUniversityQuery(
    {
      page: page,
      size: size,
      keyword,
      majorId: major,
      status,
      universityId: universityId,
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleAction = (actionType: BackdropType, JobsId: number, MajorId: number) => {
    setSelectedJobsId(JobsId);
    setSelectedMajorId(MajorId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
  };
  const [cancelJob, { isLoading: isLoadingCancel }] = useCancelJobsMutation();
  const [deleteJob, { isLoading: isLoadingDelete }] = useDeleteJobsMutation();
  const handleConfirmAction = async () => {
    if (selectedJobsId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.RefuseConfirmation: {
            await cancelJob({ job: selectedJobsId, major: selectedMajorId }).unwrap();
            toast.success('Job đã bị từ chối phê duyệt.');
            break;
          }
          case BackdropType.DeleteConfirmation: {
            await deleteJob({ job: selectedJobsId, major: selectedMajorId }).unwrap();
            toast.success('Job đã được xóa thành công!');
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
        setSelectedJobsId(null);
        setSelectedAction(null);
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoadingGetAll || isLoadingCancel || isLoadingDelete));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingGetAll, isLoadingCancel, isLoadingDelete]);
  return (
    <>
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách công việc đã ứng tuyển</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã công việc"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
            <Select
              placeholder="Chọn ngành"
              closeMenuOnSelect={true}
              options={[
                { value: null, label: 'Tất cả' },
                ...(dataMajor?.data || []).map(major => ({
                  value: major.id,
                  label: major.majorName,
                })),
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string | null> }) => {
                setMajor(selectedOption.value ? Number(selectedOption.value) : null);
              }}
              className="w-[160px] cursor-pointer"
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

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên công ty</th>
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
              jobs?.data?.content.map((job, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{job.job.company?.companyName}</td>
                  <td className="px-5 py-4">{job.job.jobTitle}</td>
                  <td className="px-5 py-4">{jobType(job.job.jobType)}</td>
                  <td className="px-5 py-4">{job.job.jobLevel.charAt(0).toUpperCase() + job.job.jobLevel.slice(1).toLowerCase()}</td>
                  <td className="px-5 py-4">{job.job?.createAt?.split(' ')[0]}</td>
                  <td className="px-2 py-4">
                    <Chip
                      label={statusTextJob(job.status).title}
                      style={{
                        color: `${statusTextJob(job.status).color}`,
                        background: `${statusTextJob(job.status).bg}`,
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ButtonSee
                        onClick={() => {
                          setSelectId(job.job.id);
                        }}
                        href={`/portal/jobs/${job.job.id}`}
                      />

                      {job.status === 'PENDING' && (
                        <>
                          <ButtonReject
                            onClick={() => {
                              handleAction(BackdropType.RefuseConfirmation, job.job.id, job.major.id);
                              dispatch(setName(job.job.jobTitle));
                            }}
                          />
                        </>
                      )}

                      {job.status === 'CANCEL' && (
                        <>
                          {!deletedJobs.includes(job.job.id) ? (
                            <ButtonDelete
                              onClick={() => {
                                handleAction(BackdropType.DeleteConfirmation, job.job.id, job.major.id);
                                dispatch(setName(job.job.jobTitle));
                              }}
                            />
                          ) : (
                            <AddToDriveIcon color="success" fontSize="small" />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-black">
                  <p>Không có công việc đã ứng tuyển nào.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationComponent
        count={jobs?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={jobs?.data.totalElements}
      />
      {/* Backdrops */}
      {(backdropType === BackdropType.ApproveConfirmation ||
        backdropType === BackdropType.RefuseConfirmation ||
        backdropType === BackdropType.DeleteConfirmation) && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && `Duyệt job ${name}`}
              {selectedAction === BackdropType.RefuseConfirmation && `Từ chối job ${name}`}
              {selectedAction === BackdropType.DeleteConfirmation && `Xóa job ${name}`}
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

export default Partnerships;
