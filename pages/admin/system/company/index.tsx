import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField, Tooltip } from '@mui/material';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { useGetAllAccountCompanyQuery } from '@/services/adminSystemApi';
import { typeAccount } from '@/utils/app/const';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonLock from '@/components/Common/ButtonIcon/ButtonLock';
import ButtonUnLock from '@/components/Common/ButtonIcon/ButtonUnLock';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { useAccountActionsCompanyAdminSystem } from '@/components/Admin/System/SystemCompany/Action';
import ButtonUp from '@/components/Common/ButtonIcon/ArrowUpwardIcon';
import ButtonArrow from '@/components/Common/ButtonIcon/ArrowDownwardIcon';

const AdminSystemCompany = () => {
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();
  const name = useAppSelector(state => state.global.name);
  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setPage(1);
        setKeyword(value);
        setSortBy(value);
      }, 500),
    []
  );
  const handleAction = (actionType: BackdropType, companyId: number, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
    dispatch(setName(companyName));
  };
  const [sortState, setSortState] = React.useState({
    activeColumn: null,
    isAsc: null,
  });

  const handleSort = (column: String, isAsc: boolean) => {
    const sortBy = `${column}:${isAsc ? 'asc' : 'desc'}`;
    setSortBy(sortBy);
    setSortState({
      activeColumn: column,
      isAsc: isAsc,
    });
  };
  const { data: companies, isLoading: isLoadingDetAll } = useGetAllAccountCompanyQuery(
    { page, size, keyword, status, sortBy: sortBy || 'companyCode:asc' },
    { refetchOnMountOrArgChange: true }
  );
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
  }, [dispatch, isLoadingDetAll]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách tài khoản doanh nghiệp</h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <TextField
              id="filled-search"
              label="Tìm kiếm tên,mã doanh nghiệp"
              type="search"
              variant="outlined"
              size="small"
              onChange={e => debouncedSearch(e.target.value)}
            />
            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'BAN', label: 'Đã khóa' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setStatus(selectedOption.value)}
              className="w-[160px] cursor-pointer"
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
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('companyCode', !(sortState.activeColumn === 'companyCode' && sortState.isAsc))}>
                    Mã doanh nghiệp
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'companyCode' && sortState.isAsc === true} onClick={() => handleSort('companyCode', true)} />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'companyCode' && sortState.isAsc === false}
                      onClick={() => handleSort('companyCode', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max " onClick={() => handleSort('companyName', !(sortState.activeColumn === 'companyName' && sortState.isAsc))}>
                    Tên doanh nghiệp
                  </span>
                  <span className="">
                    <ButtonUp isSort={sortState.activeColumn === 'companyName' && sortState.isAsc === true} onClick={() => handleSort('companyName', true)} />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'companyName' && sortState.isAsc === false}
                      onClick={() => handleSort('companyName', false)}
                    />
                  </span>
                </div>
              </th>
              <th className="cursor-pointer px-3 text-left sm:px-5">
                <div className="flex items-center">
                  <span className="min-w-max" onClick={() => handleSort('account.email', !(sortState.activeColumn === 'account.email' && sortState.isAsc))}>
                    Email
                  </span>
                  <span className="">
                    <ButtonUp
                      isSort={sortState.activeColumn === 'account.email' && sortState.isAsc === true}
                      onClick={() => handleSort('account.email', true)}
                    />
                    <ButtonArrow
                      isSort={sortState.activeColumn === 'account.email' && sortState.isAsc === false}
                      onClick={() => handleSort('account.email', false)}
                    />
                  </span>
                </div>
              </th>
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
                  <td className="w-[200px] px-5 py-4 text-center">
                    <Tooltip title={company.companyCode} placement="bottom" arrow>
                      <span
                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          maxWidth: '50px',
                        }}>
                        {company.companyCode}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="max-w-[200px] whitespace-normal break-words px-5 py-4">
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
        onPageChange={(event, value) => setPage(value)}
        onSizeChange={value => setSize(value)}
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
