import React, { useEffect, useMemo, useState } from 'react';
import { Pagination, TextField, Tooltip } from '@mui/material';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch } from 'react-redux';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BrushIcon from '@mui/icons-material/Brush';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import {
  useAcceptPartnershipsMutation,
  useCancelPartnershipsMutation,
  useGetAllPartnershipsUniversityQuery,
  useRemovePartnershipsMutation,
} from '@/services/adminSystemApi';
import ImageComponent from '@/components/Common/Image';

const JobAdminSchool = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState('ALL');
  const [selectId, setSelectId] = useState<number | null>(null);
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

  const { data: partnerships, isLoading: isLoadingGetAll } = useGetAllPartnershipsUniversityQuery(
    { page, size, universityId },
    { refetchOnMountOrArgChange: true }
  );

  const [accept, { isLoading: isLoadingAccept }] = useAcceptPartnershipsMutation();
  const [cancel, { isLoading: isLoadingCancel }] = useCancelPartnershipsMutation();
  const [remove, { isLoading: isLoadingRemove }] = useRemovePartnershipsMutation();
  const handleConfirmAction = async () => {
    if (showBackdrop) {
      try {
        switch (showBackdrop) {
          case BackdropType.ApproveConfirmation: {
            const response = await accept({ accountLoginId: universityId, acceptToAccountId: selectId }).unwrap();
            toast.success(response.message);
            break;
          }
          case BackdropType.RefuseConfirmation: {
            const response = await cancel({ accountLoginId: universityId, cancelToAccountId: selectId }).unwrap();
            toast.success(response.message);
            break;
          }
          case BackdropType.DeleteConfirmation: {
            const response = await remove({ accountLoginId: universityId, removeToAccountId: selectId }).unwrap();
            toast.success(response.message);
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
    dispatch(setLoading(isLoadingGetAll || isLoadingAccept || isLoadingCancel || isLoadingRemove));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingGetAll, isLoadingAccept, isLoadingCancel, isLoadingRemove]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Quản lý đối tác</h1>
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
        {/* <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Mã công ty</th>
              <th className="px-5 py-4 text-left">Tên công ty</th>
              <th className="px-5 py-4 text-left">Mã số thuế</th>
              <th className="px-5 py-4 text-left">Số điện thoại</th>
              <th className="px-5 py-4 text-left">Ngày thành lập</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {partnerships?.data.content.length !== 0 ? (
              partnerships?.data.content.map((partnership, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{partnership.company.companyCode}</td>
                  <td className="px-5 py-4">{partnership.company.companyName}</td>
                  <td className="px-5 py-4">{partnership.company.taxCode}</td>
                  <td className="px-5 py-4">{partnership.company.phoneNumber}</td>
                  <td className="px-5 py-4">{partnership.company.establishedDate}</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={StatusJob(partnership.partnershipStatus).title}
                      style={{ color: `${StatusJob(partnership.partnershipStatus).color}`, backgroundColor: `${StatusJob(partnership.partnershipStatus).bg}` }}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Tooltip title="Chấp nhận lời mời">
                      <IconButton
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setName(partnership.company.companyName));
                        }}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Từ chối lời mời">
                      <IconButton
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setName(partnership.company.companyName));
                        }}>
                        <CancelIcon color="warning" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa lời mời">
                      <IconButton
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          dispatch(setName(partnership.company.companyName));
                        }}>
                        <DeleteIcon color="error" />
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
        </table> */}
        <div>
          {/* Row */}
          <div className="p-5">
            <div className="grid grid-cols-1 items-center justify-between pb-4 sm:grid-cols-2">
              <div>
                <h6 className="mb-4 sm:mb-0">Doanh nghiệp đối tác</h6>
              </div>
              <div className="mx-auto flex items-center gap-2 sm:ml-auto sm:mr-0">
                <button
                  onClick={() => {
                    dispatch(setStatus(''));
                    setActive('ALL');
                  }}
                  className={`rounded-lg ${active === 'ALL' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Tất cả: 200
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('PENDING'));
                    setActive('PENDING');
                  }}
                  className={`rounded-lg ${active === 'PENDING' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Đang chờ: 100
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('ACCEPT'));
                    setActive('ACCEPT');
                  }}
                  className={`rounded-lg ${active === 'ACCEPT' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Chấp nhận: 100
                </button>
                <button
                  onClick={() => {
                    dispatch(setStatus('CANCEL'));
                    setActive('CANCEL');
                  }}
                  className={`rounded-lg ${active === 'CANCEL' ? 'bg-primary-main' : ''} bg-black px-4 py-[7px] text-xs text-white`}>
                  Từ chối: 100
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-wrap justify-start gap-x-3 gap-y-4">
              {partnerships?.data.content.map(partner => (
                <div className="rounded-lg border border-solid px-4 py-5" key={partner.company.id}>
                  <div className="flex w-full flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap">
                      <Link href={''}>
                        <ImageComponent
                          src={partner.company.logoUrl}
                          alt={partner.company?.companyName}
                          width={80}
                          height={80}
                          className="h-20 rounded-full border border-solid"
                        />
                      </Link>
                      <div className="ml-0 font-semibold sm:ml-4">
                        <Link href={''}>
                          <h4 className="mb-[6px] font-semibold hover:text-primary-main">{partner.company.companyName}</h4>
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] text-[#002c3fb3] sm:gap-3 sm:text-[12px]">
                          <span>{partner.company?.fields[0]?.fieldName}...</span>
                          <span>
                            <LocationOnIcon fontSize="small" />
                            {partner.company.address?.province.provinceName}
                          </span>
                          <span>Mã số thuế: {partner.company.taxCode}</span>
                        </div>
                      </div>
                    </div>
                    {/* Button */}
                    <div className="flex items-center gap-3">
                      {partner.partnershipStatus === 'CANCEL' ? null : partner.partnershipStatus === 'ACCEPT' ? (
                        <Tooltip title="Xóa">
                          <div
                            className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2943]"
                            onClick={() => {
                              dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                              dispatch(setName(partner.company.companyName));
                              setSelectId(partner.company.account.id);
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
                                dispatch(setName(partner.company.companyName));
                                setSelectId(partner.company.account.id);
                              }}>
                              <DoneAllIcon color="success" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Từ chối">
                            <div
                              className="cursor-pointer rounded-lg bg-[#ffa4101a] px-2 py-[6px] transition-all hover:bg-[#ffa31048]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                                dispatch(setName(partner.company.companyName));
                                setSelectId(partner.company.account.id);
                              }}>
                              <CancelIcon color="warning" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Xóa">
                            <div
                              className="cursor-pointer rounded-lg bg-[#a70a291a] px-2 py-[6px] transition-all hover:bg-[#a70a2934]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                                dispatch(setName(partner.company.companyName));
                                setSelectId(partner.company.account.id);
                              }}>
                              <DeleteIcon color="error" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Chỉnh sửa">
                            <div
                              className="cursor-pointer rounded-lg bg-[#0098681a] px-2 py-[6px] transition-all hover:bg-[#00986849]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                                dispatch(setName(partner.company.companyName));
                                setSelectId(partner.company.account.id);
                              }}>
                              <BrushIcon color="success" fontSize="small" />
                            </div>
                          </Tooltip>

                          <Tooltip title="Chỉnh sửa">
                            <div
                              className="cursor-pointer rounded-lg bg-[#1966d227] px-2 py-[6px] transition-all hover:bg-[#1966d254]"
                              onClick={() => {
                                dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                                dispatch(setName(partner.company.companyName));
                                setSelectId(partner.company.account.id);
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
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={partnerships?.data.totalPages} page={page} onChange={(event, value) => dispatch(setPage(value))} color="primary" shape="rounded" />
        <p className="text-sm">
          ({partnerships?.data.currentPage} / {partnerships?.data.totalPages})
        </p>
      </div>
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

export default JobAdminSchool;
