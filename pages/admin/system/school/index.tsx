import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chip } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';

import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { useGetAllAccountSchoolQuery } from '@/services/adminSystemApi';
import { typeAccount, typeUniversity, typeUniversityTitle } from '@/utils/app/const';
import ButtonUnLock from '@/components/Common/ButtonIcon/ButtonUnLock';
import ButtonLock from '@/components/Common/ButtonIcon/ButtonLock';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { useAccountActionsCompanyAdminSystem } from '@/components/Admin/System/SystemCompany/Action';
import Search from '@/components/Common/Search';

const AdminSystemSchool = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [universityType, setUniversityType] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const dispatch = useDispatch();
  const handleAction = useCallback(
    (actionType: BackdropType, companyId: number, universityName: string) => {
      setSelectedCompanyId(companyId);
      setSelectedAction(actionType);
      dispatch(setBackdrop(actionType));
      dispatch(setName(universityName));
    },
    [dispatch]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );

  const { data: universities, isLoading: isLoadingDetAll } = useGetAllAccountSchoolQuery(
    { page, size, keyword, status, universityType },
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
        <h1 className="mb-5 font-bold">Doanh sách tài khoản trường học</h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Search
              onChange={e => {
                setInputValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              value={inputValue}
              onClear={() => {
                setInputValue('');
                setKeyword('');
                debouncedSearch('');
              }}
              placeholder="Tìm kiếm tên, mã trường học"
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
            <Select
              placeholder="Loại trường"
              closeMenuOnSelect={true}
              options={typeUniversity.map(type => ({
                value: type.value,
                label: type.label,
              }))}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => setUniversityType(selectedOption.value)}
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
              <th className="px-5 py-4 text-left">Mã trường học</th>
              <th className="px-5 py-4 text-left">Tên tên trường học</th>
              <th className="px-5 py-4 text-left">Loại trường</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Trạng thái</th>
              <th className="px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {universities?.data.content.length !== 0 ? (
              universities?.data.content.map((university, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="px-5 py-4 text-center"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{university.universityCode}</td>
                  <td className="px-5 py-4">
                    <p>{university.universityName}</p>
                  </td>
                  <td className="px-5 py-4">{typeUniversityTitle(university.universityType).title}</td>
                  <td className="px-5 py-4">{university.account.email ? university.account.email : 'Chưa có email'}</td>
                  <td className="px-5 py-4">
                    <Chip
                      label={typeAccount(university?.account?.statusAccount)?.title}
                      sx={{
                        backgroundColor: typeAccount(university?.account?.statusAccount)?.bg,
                        color: typeAccount(university?.account?.statusAccount)?.color,
                      }}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <ButtonSee href={`/admin/system/school/${university.id}`} onClick={() => dispatch(setId(university.id))} />
                      {university?.account?.statusAccount === 'PENDING' && (
                        <>
                          <ButtonAccept onClick={() => handleAction(BackdropType.ApproveConfirmation, university.account.id, university.universityName)} />

                          <ButtonReject onClick={() => handleAction(BackdropType.RefuseConfirmation, university.account.id, university.universityName)} />
                        </>
                      )}
                      {university?.account?.statusAccount === 'ACTIVE' && (
                        <ButtonLock onClick={() => handleAction(BackdropType.LockConfirmation, university.account.id, university.universityName)} />
                      )}
                      {university?.account?.statusAccount === 'BAN' && (
                        <ButtonUnLock onClick={() => handleAction(BackdropType.UnlockConfirmation, university.account.id, university.universityName)} />
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
        count={universities?.data.totalPages}
        onPageChange={(event, value) => setPage(value)}
        totalItem={universities?.data.totalElements}
        onSizeChange={value => setSize(value)}
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
          name={name}
          onClick={handleConfirmAction}
        />
      )}
    </>
  );
};

export default AdminSystemSchool;
