import { TextField } from '@mui/material';
import { debounce } from 'lodash';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ImageComponent from '@/components/Common/Image';
import { useGetAllJobAppliesCompanyQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { typeUniversityTitle } from '@/utils/app/const';
import PaginationComponent from '@/components/Common/Pagination';
import { setId, setLoading, setName, setUId } from '@/store/slices/global';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';

const SchoolApplyJob = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const dispatch = useDispatch();
  const companyId = useAppSelector(state => state.user.id);
  const id = useAppSelector(state => state.global.id);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );

  const { data: universityApply, isLoading } = useGetAllJobAppliesCompanyQuery(
    { companyId, jobId: id, keyword, page, size, status: 'ACCEPT' },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <div className="flex items-center justify-between">
          <h1 className="mb-5 font-bold">Quản lý trường học apply job</h1>
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
              {universityApply?.data.content.length > 0 ? (
                universityApply?.data.content.map(apply => (
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
                          <div className="items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px] md:flex">
                            <p className="ml-[6px] md:ml-0">Mã trường học: {apply.university.universityCode}</p>
                            <div className="flex">
                              <LocationOnIcon fontSize="small" />
                              <p className="mt-[1px]">
                                `{apply.university?.address?.district.districtName}, {apply.university?.address?.province.provinceName}`
                              </p>
                            </div>
                            <p className="ml-[6px] md:ml-0">Loại trường: {typeUniversityTitle(apply?.university.universityType).title}</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#171717df] sm:gap-3 sm:text-[12px]">
                            <span>Chuyên nghành: {apply.major.majorName}</span>
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
                        <ButtonSee
                          onClick={() => {
                            dispatch(setId(apply?.job.id));
                            dispatch(setUId(apply.university.id));
                            dispatch(setName(apply?.job.jobTitle));
                          }}
                          href="/admin/company/student-apply-job"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Không có dữ liệu nào</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <PaginationComponent
        count={universityApply?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={universityApply?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};
export default SchoolApplyJob;
