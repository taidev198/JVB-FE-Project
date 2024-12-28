import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Chip, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import PaginationComponent from '@/components/Common/Pagination';
import ImageComponent from '@/components/Common/Image';
import { setKeyword } from '@/store/slices/filtersSlice';
import { useApproveCompanyApplyWorkshopMutation, useGetAllCompanyApplyWorkshopsQuery, useRejectCompanyApplyWorkshopMutation } from '@/services/adminSchoolApi';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import { StatusJobCompanyApply } from '@/utils/app/const';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import { BackDrop } from '@/components/Common/BackDrop';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { Button } from '@/components/Common/Button';

const CompanyApplyWorkshop = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState();
  const [status, setStatus] = useState<string>('ACCEPT');
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyWord] = useState<string | null>(null);
  const { size } = useAppSelector(state => state.filter);
  const idWorkshop = useAppSelector(state => state.global.id);
  const workshopTitle = useAppSelector(state => state.global.name);
  const showBackdrop = useAppSelector(state => state.global.backdropType);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyWord(value);
        setPage(1);
      }, 500),
    [dispatch]
  );

  const { data: companyApply, isLoading } = useGetAllCompanyApplyWorkshopsQuery(
    { page, size, keyword, id: idWorkshop, status },
    { refetchOnMountOrArgChange: true }
  );
  const [approve] = useApproveCompanyApplyWorkshopMutation();
  const [reject] = useRejectCompanyApplyWorkshopMutation();

  const handleConfirmActionApply = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            await approve({ id }).unwrap();
            toast.success('Đồng ý doanh nghiệp tham gia workshop thành công');
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await reject({ id }).unwrap();
            toast.success('Từ chối doanh nghiệp tham gia workshop thành công');
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
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className=" overflow-y-auto">
      <div className="rounded-t-md bg-white p-5 pb-5">
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="mb-5 font-bold">Danh sách công ty tham gia workshop {workshopTitle}</h1>
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
        <div className="mt-3 flex items-center  gap-3 sm:mt-0">
          <TextField
            id="filled-search"
            label="Tìm kiếm tên, mã công ty"
            type="search"
            variant="outlined"
            size="small"
            onChange={e => debouncedSearch(e.target.value)}
            className="w-[310px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white">
        <div>
          {/* Row */}
          <div className="p-5">
            <div className="flex flex-col flex-wrap justify-start gap-x-3 gap-y-4">
              {companyApply?.data.content.map(partner => (
                <div className="rounded-lg border border-solid px-4 py-5" key={partner.company.id}>
                  <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center justify-between">
                      <ImageComponent
                        src={partner.company.logoUrl}
                        alt={partner.company?.companyName}
                        width={80}
                        height={80}
                        className="rounded-full border border-solid object-contain"
                        pro={partner.isPartnership === true ? true : false}
                      />
                      <div className="ml-0 font-semibold sm:ml-4">
                        <h4 className="mb-[6px] font-semibold">{partner.company.companyName}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <span>Mã công ty: {partner.company.companyCode}</span>
                          <span>
                            <LocationOnIcon fontSize="small" />
                            {partner.company.address?.district.districtName}, {partner.company.address?.province.provinceName}
                          </span>
                          <span>Mã số thuế: {partner.company.taxCode}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Chip
                        label={StatusJobCompanyApply(partner.status)?.title}
                        sx={{
                          backgroundColor: StatusJobCompanyApply(partner.status)?.bg,
                          color: StatusJobCompanyApply(partner.status)?.color,
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#002c3fb3]">
                        <div className="font-bold text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <div>
                            <span>Ngày diễn ra: </span>
                            <span className="text-primary-main">12-44</span>
                          </div>
                          <div>
                            <span>Hết kết thúc:</span>
                            <span className="text-[#a70a29]">5-4</span>
                          </div>
                        </div>
                      </span>
                    </div>
                    {/* Button */}
                    <div className="flex items-center gap-3">
                      {status === 'PENDING' && (
                        <>
                          <ButtonAccept
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                              setId(partner.id);
                            }}
                          />
                          <ButtonReject
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                              setId(partner.id);
                            }}
                          />
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
        count={companyApply?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={companyApply?.data.totalElements}
      />

      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[430px] rounded-md p-6">
            <h3 className="font-bold">
              {showBackdrop === BackdropType.ApproveConfirmation && `Chấp nhận doanh nghiệp tham gia`}
              {showBackdrop === BackdropType.RefuseConfirmation && `Từ chối doanh nghiệp tham gia`}
            </h3>
            <p className="mt-1">Bạn có chắc chắn muốn thực hiện hành động này?</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" full={true} onClick={handleConfirmActionApply} />
            </div>
          </div>
        </BackDrop>
      )}
    </div>
  );
};
export default CompanyApplyWorkshop;
