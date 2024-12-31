import { TextField } from '@mui/material';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';
import ImageComponent from '@/components/Common/Image';
import {
  useAcceptJobsForUniversityMutation,
  useCancelJobsForUniversityMutation,
  useGetAllJobAppliesCompanyQuery,
  useRemoveJobsForUniversityMutation,
} from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { typeUniversityTitle } from '@/utils/app/const';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';

const SchoolApplyJob = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('ACCEPT');
  const companyId = useAppSelector(state => state.user.id);
  const name = useAppSelector(state => state.user.name);
  const [majorId, setMajorId] = useState<number | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);
  const { keyword, page, size } = useAppSelector(state => state.filter);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: universityApply } = useGetAllJobAppliesCompanyQuery({ companyId, keyword, page, size, status }, { refetchOnMountOrArgChange: true });

  const [accpect, { isLoading: AccpectLoading }] = useAcceptJobsForUniversityMutation();
  const [cancel, { isLoading: CancelLoading }] = useCancelJobsForUniversityMutation();
  const [remove, { isLoading: RemoveLoading }] = useRemoveJobsForUniversityMutation();
  const handleConfirmActionApply = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            await accpect({ major: majorId, job: jobId }).unwrap();
            toast.success('Chấp nhận trường học apply thành công');
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await cancel({ major: majorId, job: jobId }).unwrap();
            toast.success('Từ chối trường học apply thành công');
            break;
          }
          case BackdropType.DeleteConfirmation: {
            await remove({ major: majorId, job: jobId }).unwrap();
            toast.success('Xóa trường học apply thành công');
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
    dispatch(setLoading(AccpectLoading || CancelLoading || RemoveLoading));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, AccpectLoading, CancelLoading, RemoveLoading]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <div className="flex items-center justify-between">
          <h1 className="mb-5 font-bold">Quản lý trường học apply job</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setStatus('ACCEPT');
                setPage(1);
                dispatch(setKeyword(''));
              }}
              className={`rounded-lg ${status === 'ACCEPT' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
              Đã tham gia
            </button>

            <button
              onClick={() => {
                setStatus('PENDING');
                setPage(1);
                dispatch(setKeyword(''));
              }}
              className={`rounded-lg ${status === 'PENDING' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
              Chờ duyệt
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên trường, job"
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
            <div className="flex flex-col flex-wrap justify-start gap-x-3 gap-y-4">
              {universityApply?.data.content.map(apply => (
                <div className="rounded-lg border border-solid px-4 py-5" key={apply?.university.id}>
                  <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center justify-between">
                      <ImageComponent
                        src={apply.university?.logoUrl}
                        alt={apply.university.universityName}
                        width={80}
                        height={80}
                        className="rounded-full border border-solid object-contain"
                        pro={apply.isPartnership}
                      />
                      <div className="ml-0 font-semibold sm:ml-4">
                        <h4 className="mb-[6px] font-semibold">{apply.university.universityName}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <span>Mã trường học: {apply.university.universityCode}</span>
                          <span>
                            <LocationOnIcon fontSize="small" />
                            {apply.university?.address?.district.districtName}, {apply.university?.address?.province.provinceName}
                          </span>
                          <span>Loại trường: {typeUniversityTitle(apply?.university.universityType).title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#171717df] sm:gap-3 sm:text-[12px]">
                          <span>Apply: {apply.job.jobTitle}</span>
                        </div>
                      </div>
                    </div>
                    <div></div>
                    <div>
                      <span className="text-xs font-bold text-[#002c3fb3]"></span>
                    </div>
                    {/* Button */}
                    <div className="flex items-center gap-3">
                      {status === 'PENDING' && (
                        <>
                          <ButtonAccept
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                              setJobId(apply?.job.id);
                              setMajorId(apply?.major.id);
                              setName(apply.job.jobTitle);
                            }}
                          />
                          <ButtonReject
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                              setJobId(apply.job.id);
                              setMajorId(apply?.major.id);
                              setName(apply.job.jobTitle);
                            }}
                          />
                        </>
                      )}

                      {status === 'ACCEPT' && (
                        <ButtonDelete
                          onClick={() => {
                            dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                            setJobId(apply.job.id);
                            setMajorId(apply?.major.id);
                            setName(apply.job.jobTitle);
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
        count={universityApply?.data.totalPages}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={universityApply?.data.totalElements}
      />

      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[430px] rounded-md p-6">
            <h3 className="font-bold">
              {showBackdrop === BackdropType.ApproveConfirmation && `Chấp nhận trường học apply ${name}`}
              {showBackdrop === BackdropType.RefuseConfirmation && `Từ chối trường học apply ${name}`}
              {showBackdrop === BackdropType.DeleteConfirmation && `Xóa trường học apply ${name}`}
            </h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmActionApply} />
            </div>
          </div>
        </BackDrop>
      )}
    </>
  );
};
export default SchoolApplyJob;
