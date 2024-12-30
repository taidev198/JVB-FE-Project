import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch } from 'react-redux';
import WorkIcon from '@mui/icons-material/Work';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useApproveJobsMutation, useGetAllJobsAdminSystemQuery, useRejectJobsMutation } from '@/services/adminSystemApi';
import ImageComponent from '@/components/Common/Image';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import { statusLabelJob } from '@/utils/app/const';

const AdminSystemJob = () => {
  const dispatch = useDispatch();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [active, setActive] = useState('ALL');
  const { page, size, keyword, status } = useAppSelector(state => state.filter);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: jobs, isLoading: isLoadingGetAll } = useGetAllJobsAdminSystemQuery({ page, size, keyword, status }, { refetchOnMountOrArgChange: true });
  const [approveJob, { isLoading: isLoadingApprove }] = useApproveJobsMutation();
  const [rejectJob, { isLoading: isLoadingReject }] = useRejectJobsMutation();
  const handleConfirmAction = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            await approveJob({ id: selectedJobId }).unwrap();
            toast.success('Job đã được duyệt thành công!');
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await rejectJob({ id: selectedJobId }).unwrap();
            toast.success('Đã từ chối job thành công!');
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
      }
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoadingApprove || isLoadingReject || isLoadingGetAll));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingApprove, isLoadingReject, isLoadingGetAll]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý jobs</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên job"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white">
        <div>
          {/* Row */}
          <div className="p-5">
            <div className="grid grid-cols-1 items-center justify-between pb-4 sm:grid-cols-2">
              <div>
                <h6 className="mb-4 sm:mb-0">Danh sách jobs</h6>
              </div>
              <div className="mx-auto flex items-center gap-2  sm:ml-auto sm:mr-0">
                <button
                  onClick={() => {
                    dispatch(setStatus(''));
                    setActive('ALL');
                  }}
                  className={`rounded-lg ${active === 'ALL' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Tất cả
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('PENDING'));
                    setActive('PENDING');
                  }}
                  className={`rounded-lg ${active === 'PENDING' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Đang chờ
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('APPROVED'));
                    setActive('APPROVED');
                  }}
                  className={`rounded-lg ${active === 'APPROVED' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Chấp nhận
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('REJECT'));
                    setActive('REJECT');
                  }}
                  className={`rounded-lg ${active === 'REJECT' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Từ chối
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-wrap justify-start gap-x-3 gap-y-4">
              {jobs?.data.content.map(job => (
                <div className="rounded-lg border border-solid px-4 py-5" key={job.id}>
                  <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap">
                      {/* Image */}
                      <Link href={''}>
                        <ImageComponent
                          src={job.company?.logoUrl}
                          alt={job.company?.companyName}
                          width={80}
                          height={80}
                          className="h-20 rounded-full border border-solid object-contain"
                        />
                      </Link>
                      <div className="ml-0 font-semibold sm:ml-4">
                        <h4 className="mb-[6px] font-semibold">{job.jobTitle}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <div className="flex items-center gap-1">
                            <WorkIcon sx={{ fontSize: '15px' }} />
                            <span>{job.jobLevel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <LocationOnIcon sx={{ fontSize: '15px' }} />
                            {job.company?.address.district.districtName}, {job.company?.address.province.provinceName}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Time */}
                    <div className="font-bold text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                      <div>
                        <span>Ngày đăng: </span>
                        <span className="text-primary-main">{job.createAt?.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span>Hết hạn:</span>
                        <span className="text-[#a70a29]">{job.expirationDate}</span>
                      </div>
                    </div>
                    <div>
                      <Chip
                        label={statusLabelJob(job.status)?.title}
                        sx={{
                          backgroundColor: statusLabelJob(job.status)?.bg,
                          color: statusLabelJob(job.status)?.color,
                        }}
                      />
                    </div>
                    {/* Button */}
                    <div className="flex items-center gap-2">
                      {job.status === 'PENDING' && (
                        <>
                          <ButtonAccept
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                              dispatch(setName(job.jobTitle));
                              setSelectedJobId(job?.id);
                            }}
                          />

                          <ButtonReject
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                              dispatch(setName(job.jobTitle));
                              setSelectedJobId(job?.id);
                            }}
                          />
                        </>
                      )}
                      {job.status !== 'REJECT' && (
                        <ButtonSee
                          href={`/portal/jobs/${job?.id}`}
                          onClick={() => {
                            setSelectedJobId(job?.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <PaginationComponent
        count={jobs?.data.totalPages}
        page={page}
        size={size}
        totalItem={jobs?.data.totalElements}
        onPageChange={(event, value) => dispatch(setPage(value))}
      />
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[430px] rounded-md p-6">
            <h3 className="font-bold">
              {showBackdrop === BackdropType.ApproveConfirmation && `Duyệt job ${name}`}
              {showBackdrop === BackdropType.RefuseConfirmation && `Từ chối job ${name}`}
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

export default AdminSystemJob;
