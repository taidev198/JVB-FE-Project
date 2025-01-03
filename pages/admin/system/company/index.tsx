import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { useGetAllAccountCompanyQuery } from '@/services/adminSystemApi';
import { typeAccount } from '@/utils/app/const';
import { resetFilters, setKeyword, setPage, setStatus } from '@/store/slices/filtersSlice';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonLock from '@/components/Common/ButtonIcon/ButtonLock';
import ButtonUnLock from '@/components/Common/ButtonIcon/ButtonUnLock';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { useAccountActionsCompanyAdminSystem } from '@/components/Admin/System/SystemCompany/Action';

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

  const { data: companies, isLoading: isLoadingDetAll } = useGetAllAccountCompanyQuery({ page, size, keyword, status }, { refetchOnMountOrArgChange: true });
  const { approveAccount, rejectAccount, lockAccount, unlockAccount } = useAccountActionsCompanyAdminSystem();
  const handleConfirmAction = () => {
    if (selectedCompanyId !== null && selectedAction) {
      switch (selectedAction) {
        case BackdropType.ApproveConfirmation || BackdropType.UnlockConfirmation: {
          approveAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' });
          break;
        }
        case BackdropType.UnlockConfirmation: {
          unlockAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' });
          break;
        }
        case BackdropType.RefuseConfirmation: {
          rejectAccount({ id: selectedCompanyId });
          break;
        }
        case BackdropType.LockConfirmation: {
          lockAccount({ id: selectedCompanyId, statusAccount: 'BAN' });
          break;
        }
        default:
          throw new Error('Invalid action type');
      }
      dispatch(setBackdrop(null));
      setSelectedCompanyId(null);
      setSelectedAction(null);
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoadingDetAll));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, isLoadingDetAll]);
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
              label="Tìm kiếm tên, mã doanh nghiệp"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
              className="w-fit sm:w-[280px]"
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
              <th className="px-5 py-4 text-left">Mã doanh nghiệp</th>
              <th className="px-5 py-4 text-left">Tên doanh nghiệp</th>
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
                  <p>Không có tài khoản doanh nghiệp nào</p>
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
        <PopupConfirmAction
          text={
            selectedAction === BackdropType.ApproveConfirmation
              ? 'Duyệt'
              : selectedAction === BackdropType.RefuseConfirmation
              ? 'Từ chối'
              : selectedAction === BackdropType.LockConfirmation
              ? 'Khóa'
              : selectedAction === BackdropType.UnlockConfirmation
              ? 'Mở khóa'
              : ''
          }
          name={`tài khoản doanh nghiệp ${name}`}
          onClick={handleConfirmAction}
        />
      )}
    </>
  );
};

export default AdminSystemCompany;
