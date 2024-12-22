import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Tooltip } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch } from 'react-redux';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WorkIcon from '@mui/icons-material/Work';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useGetAllJobsAdminSystemQuery } from '@/services/adminSystemApi';
import ImageComponent from '@/components/Common/Image';
import PaginationComponent from '@/components/Common/Pagination';

const AdminSystemJob = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState('ALL');
  const { page, size } = useAppSelector(state => state.filter);
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

  const { data: jobs, isLoading: isLoadingGetAll } = useGetAllJobsAdminSystemQuery({ page, size }, { refetchOnMountOrArgChange: true });

  const handleConfirmAction = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            break;
          }
          case BackdropType.RefuseConfirmation: {
            break;
          }
          case BackdropType.DeleteConfirmation: {
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
    dispatch(setLoading(isLoadingGetAll));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingGetAll]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý jobs</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
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
      <div className="w-full overflow-x-auto bg-white">
        <div>
          {/* Row */}
          <div className="p-5">
            <div className="grid grid-cols-1 items-center justify-between pb-4 sm:grid-cols-2">
              <div>
                <h6 className="mb-4 sm:mb-0">Doanh nghiệp đối tác</h6>
              </div>
              <div className="mx-auto flex items-center gap-2  sm:ml-auto sm:mr-0">
                <button
                  onClick={() => {
                    dispatch(setStatus(''));
                    setActive('ALL');
                  }}
                  className={`rounded-lg ${active === 'ALL' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Tất cả: 200
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('PENDING'));
                    setActive('PENDING');
                  }}
                  className={`rounded-lg ${active === 'PENDING' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Đang chờ: 100
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('ACCEPT'));
                    setActive('ACCEPT');
                  }}
                  className={`rounded-lg ${active === 'ACCEPT' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Chấp nhận: 100
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('CANCEL'));
                    setActive('CANCEL');
                  }}
                  className={`rounded-lg ${active === 'CANCEL' ? 'bg-primary-main transition-all' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Từ chối: 100
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
                          className="h-20 rounded-full border border-solid"
                        />
                      </Link>
                      <div className="ml-0 font-semibold sm:ml-4">
                        <Link href={''}>
                          <h4 className="mb-[6px] font-semibold hover:text-primary-main">{job.jobTitle}</h4>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <div className="flex items-center gap-1">
                            <WorkIcon sx={{ fontSize: '15px' }} />
                            <span>{job.jobLevel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <LocationOnIcon sx={{ fontSize: '15px' }} />
                            Nam Từ Liêm, Ha Noi
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Time */}
                    <div className="font-bold text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                      <div>
                        <span>Ngày đăng: </span>
                        <span className="text-primary-main"> 17 Apr 2023</span>
                      </div>
                      <div>
                        <span>Hết hạn:</span>
                        <span className="text-[#a70a29]">12 Jun 2024</span>
                      </div>
                    </div>
                    {/* Button */}
                    <div className="flex items-center gap-3">
                      {job.status === 'CANCEL' ? null : job.status === 'ACCEPT' ? (
                        <Tooltip title="Xóa">
                          <div
                            className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2943]"
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                              dispatch(setName(job.jobTitle));
                            }}>
                            <DeleteIcon color="error" fontSize="small" />
                          </div>
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip title="Chấp nhận">
                            <div
                              className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                                dispatch(setName(job.jobTitle));
                              }}>
                              <DoneAllIcon color="success" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Từ chối">
                            <div
                              className="cursor-pointer rounded-lg bg-[#ffa4101a] px-2 py-[6px] transition-all hover:bg-[#ffa31048]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                                dispatch(setName(job.jobTitle));
                              }}>
                              <CancelIcon color="warning" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Xóa">
                            <div
                              className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2934]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                                dispatch(setName(job.jobTitle));
                              }}>
                              <DeleteIcon color="error" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Chỉnh sửa">
                            <div
                              className="cursor-pointer rounded-lg bg-[#1966d227] px-2 py-[6px] transition-all hover:bg-[#1966d254]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                                dispatch(setName(job.jobTitle));
                              }}>
                              <RemoveRedEyeIcon color="info" fontSize="small" />
                            </div>
                          </Tooltip>
                        </>
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
        totalTitle={'jobs'}
      />
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {showBackdrop === BackdropType.ApproveConfirmation && `Duyệt tài khoản ${name}`}
              {showBackdrop === BackdropType.RefuseConfirmation && `Từ chối tài khoản ${name}`}
              {showBackdrop === BackdropType.DeleteConfirmation && `Xóa ${name}`}
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
