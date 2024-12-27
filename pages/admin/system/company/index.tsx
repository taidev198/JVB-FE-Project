import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { useBanAndActiveMutation, useGetAllAccountCompanyQuery, useRejectAccountCompanyMutation } from '@/services/adminSystemApi';
import { typeAccount } from '@/utils/app/const';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonLock from '@/components/Common/ButtonIcon/ButtonLock';
import ButtonUnLock from '@/components/Common/ButtonIcon/ButtonUnLock';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';

const AdminSystemCompany = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();
  const name = useAppSelector(state => state.global.name);
  const { page, size, status, keyword } = useAppSelector(state => state.filter);

  const handleAction = (actionType: BackdropType, companyId: number, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
    dispatch(setName(companyName));
  };
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: companies, isLoading: isLoadingDetAll } = useGetAllAccountCompanyQuery({ page, size, keyword, status });
  const [rejectAccount, { isLoading: isLoadingReject }] = useRejectAccountCompanyMutation();
  const [banAndActiveAccount] = useBanAndActiveMutation();
  const handleConfirmAction = async () => {
    if (selectedCompanyId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.ApproveConfirmation || BackdropType.UnlockConfirmation: {
            await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' }).unwrap();
            toast.success('Tài khoản đã được duyệt thành công.');
            break;
          }
          case BackdropType.UnlockConfirmation: {
            await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' }).unwrap();
            toast.success('Tài khoản đã được mở khóa thành công.');
            break;
          }
          case BackdropType.RefuseConfirmation: {
            await rejectAccount({ id: selectedCompanyId }).unwrap();
            toast.success('Yêu cầu duyệt tài khoản đã bị từ chối.');
            break;
          }
          case BackdropType.LockConfirmation: {
            await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'BAN' }).unwrap();
            toast.success('Tài khoản đã bị khóa thành công.');
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
        setSelectedCompanyId(null);
        setSelectedAction(null);
      }
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoadingDetAll || isLoadingReject));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingDetAll, isLoadingReject]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản doanh nghiệp</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'BAN', label: 'Đã khóa' },
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
              <th className="px-5 py-4">STT</th>
              <th className="px-5 py-4 text-left">Mã công ty</th>
              <th className="px-5 py-4 text-left">Tên công ty</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Ngày đăng ký</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {companies?.data.content.length !== 0 ? (
              companies?.data.content.map((company, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4 text-center"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{company.companyCode}</td>
                  <td className="px-5 py-4">
                    <p>{company.companyName}</p>
                  </td>
                  <td className="px-5 py-4">{company.account.email}</td>
                  <td className="px-5 py-4">{company.createAt.split(' ')[0]}</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={typeAccount(company?.account?.statusAccount)?.title}
                      sx={{
                        backgroundColor: typeAccount(company?.account?.statusAccount)?.bg,
                        color: typeAccount(company?.account?.statusAccount)?.color,
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ButtonSee href={`/admin/system/company/${company.id}`} onClick={() => dispatch(setId(company.id))} />
                      {company?.account?.statusAccount === 'PENDING' && (
                        <>
                          <ButtonAccept onClick={() => handleAction(BackdropType.ApproveConfirmation, company.account.id, company.companyName)} />

                          <ButtonReject onClick={() => handleAction(BackdropType.RefuseConfirmation, company.account.id, company.companyName)} />
                        </>
                      )}
                      {company?.account?.statusAccount === 'ACTIVE' && (
                        <ButtonLock onClick={() => handleAction(BackdropType.LockConfirmation, company.account.id, company.companyName)} />
                      )}
                      {company?.account?.statusAccount === 'BAN' && (
                        <ButtonUnLock onClick={() => handleAction(BackdropType.UnlockConfirmation, company.account.id, company.companyName)} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base">
                  <p>Không có tài khoản trường học nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <PaginationComponent
        size={size}
        page={page}
        count={companies?.data.totalPages}
        onPageChange={(event, value) => dispatch(setPage(value))}
        totalItem={companies?.data.totalElements}
      />
      {/* Backdrops */}
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[430px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && `Duyệt tài khoản doanh nghiệp ${name}`}
              {selectedAction === BackdropType.RefuseConfirmation && `Từ chối tài khoản doanh nghiệp ${name}`}
              {selectedAction === BackdropType.LockConfirmation && `Khóa tài khoản doanh nghiệp ${name}`}
              {selectedAction === BackdropType.UnlockConfirmation && `Mở khóa tài doanh nghiệp khoản ${name}`}
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

export default AdminSystemCompany;
