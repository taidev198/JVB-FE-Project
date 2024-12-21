/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from 'react-hot-toast';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import Select from 'react-select';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';

import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { resetFilters, setKeyword, setPage, setStatus, setUniversityType } from '@/store/slices/filtersSlice';
import { useAppSelector } from '@/store/hooks';
import { useBanAndActiveMutation, useGetAllAccountSchoolQuery, useRejectAccountCompanyMutation } from '@/services/adminSystemApi';
import { typeAccount, typeUniversity, typeUniversityTitle } from '@/utils/app/const';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import ButtonUnLock from '@/components/Common/ButtonIcon/ButtonUnLock';
import ButtonLock from '@/components/Common/ButtonIcon/ButtonLock';
import ButtonReject from '@/components/Common/ButtonIcon/ButtonReject';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import PaginationComponent from '@/components/Common/Pagination';

const AdminSystemSchool = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size, status, universityType } = useAppSelector(state => state.filter);
  const dispatch = useDispatch();
  const handleAction = useCallback(
    (actionType: any, companyId: number, universityName: string) => {
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
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );

  const { data: universities, isLoading: isLoadingDetAll } = useGetAllAccountSchoolQuery(
    { page, size, keyword, status, universityType },
    { refetchOnMountOrArgChange: true }
  );
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
        <h1 className="mb-5 font-bold">Doanh sách tài khoản trường học</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Select
              placeholder="Trạng thái"
              closeMenuOnSelect={true}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'PENDING', label: 'Chờ duyệt' },
                { value: 'ACTIVE', label: 'Hoạt động' },
                { value: 'BAN', label: 'Ngưng hoạt động' },
              ]}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setStatus(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
            <Select
              placeholder="Loại trường"
              closeMenuOnSelect={true}
              options={typeUniversity.map(type => ({
                value: type.value,
                label: type.label,
              }))}
              onChange={(selectedOption: { value: React.SetStateAction<string> }) => dispatch(setUniversityType(selectedOption.value))}
              className="w-[160px] cursor-pointer"
            />
            <TextField
              id="filled-search"
              label="Tìm kiếm tên, mã trường"
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
              <th className="px-5 py-4 text-left">Mã trường học</th>
              <th className="px-5 py-4 text-left">Tên tên trường học</th>
              <th className="px-5 py-4 text-left">Loại trường</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Trạng Thái</th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
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
                  <td className="flex items-center gap-3 px-5 py-4">
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
        onPageChange={(event, value) => dispatch(setPage(value))}
        totalItem={universities?.data.totalElements}
        totalTitle={'tài khoản'}
      />
      {/* Backdrops */}
      {showBackdrop && (
        <BackDrop isCenter>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">
              {selectedAction === BackdropType.ApproveConfirmation && `Duyệt tài khoản ${name}`}
              {selectedAction === BackdropType.RefuseConfirmation && `Từ chối tài khoản ${name}`}
              {selectedAction === BackdropType.LockConfirmation && `Khóa tài khoản ${name}`}
              {selectedAction === BackdropType.UnlockConfirmation && `Mở khóa tài khoản ${name}`}
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

export default AdminSystemSchool;
