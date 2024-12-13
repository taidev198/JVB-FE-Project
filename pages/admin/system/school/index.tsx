import React, { useEffect, useState } from 'react';
import { Chip, IconButton, Tooltip, Pagination, TextField } from '@mui/material';
import Link from 'next/link';
import Select from 'react-select';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { useAppSelector } from '@/store/hooks';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';
import { useBanAndActiveMutation, useGetAllAccountSchoolQuery, useRejectAccountCompanyMutation } from '@/services/adminSystemApi';
import { typeAccount, typeUniversity, typeUniversityTitle } from '@/utils/app/const';
import { setToast } from '@/store/slices/toastSlice';

const AdminSystemSchool = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [size, setSize] = useState(5);
  const [universityType, setUniversityType] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<BackdropType | null>(null);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();
  const name = useAppSelector(state => state.global.name);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const handleAction = (actionType: BackdropType, companyId: number, universityName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedAction(actionType);
    dispatch(setBackdrop(actionType));
    dispatch(setName(universityName));
  };
  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 500);

  const { data: universities, isLoading: isLoadingDetAll } = useGetAllAccountSchoolQuery({ page, size, keyword, status, universityType });
  const [rejectAccount, { isLoading: isLoadingReject }] = useRejectAccountCompanyMutation();
  const [banAndActiveAccount] = useBanAndActiveMutation();
  const handleConfirmAction = async () => {
    if (selectedCompanyId !== null && selectedAction) {
      try {
        switch (selectedAction) {
          case BackdropType.ApproveConfirmation || BackdropType.UnlockConfirmation: {
            const response = await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' }).unwrap();
            if (response.code === 200) {
              dispatch(setToast({ message: response.message }));
            }
            if (response.code === 400) {
              dispatch(setToast({ message: response.message, type: 'error' }));
            }
            break;
          }
          case BackdropType.UnlockConfirmation: {
            const response = await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'ACTIVE' }).unwrap();
            if (response.code === 200) {
              dispatch(setToast({ message: response.message }));
            }
            if (response.code === 400) {
              dispatch(setToast({ message: response.message, type: 'error' }));
            }
            break;
          }
          case BackdropType.RefuseConfirmation: {
            const response = await rejectAccount({ id: selectedCompanyId }).unwrap();
            if (response.code === 200) {
              dispatch(setToast({ message: response.message }));
            }
            if (response.code === 400) {
              dispatch(setToast({ message: response.message, type: 'error' }));
            }
            break;
          }
          case BackdropType.LockConfirmation: {
            const response = await banAndActiveAccount({ id: selectedCompanyId, statusAccount: 'BAN' }).unwrap();
            if (response.code === 200) {
              dispatch(setToast({ message: response.message }));
            }
            if (response.code === 400) {
              dispatch(setToast({ message: response.message, type: 'error' }));
            }
            break;
          }
          default:
            throw new Error('Invalid action type');
        }
      } catch (error) {
        console.error('Error performing action:', error);
      } finally {
        dispatch(setBackdrop(null));
        setSelectedCompanyId(null);
        setSelectedAction(null);
      }
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoadingDetAll || isLoadingReject));
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
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Mã trường học</th>
              <th className="px-5 py-4 text-left">Tên tên trường học</th>
              <th className="px-5 py-4 text-left">Loại trường</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Trạng Thái</th>
              <th className="px-5 py-4 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {universities?.data.content.map((university, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                <td className="px-5 py-4">{university.universityCode}</td>
                <td className="px-5 py-4">
                  <Link href={`/admin/system/company/${university.id}`} className=" hover:text-primary-main" onClick={() => dispatch(setId(university.id))}>
                    {university.universityName}
                  </Link>
                </td>
                <td className="px-5 py-4">{typeUniversityTitle(university.universityType).title}</td>
                <td className="px-5 py-4">{university.email ? university.email : 'Chưa có email'}</td>
                <td className="px-5 py-4">
                  <Chip
                    label={typeAccount(university?.account?.statusAccount)?.title}
                    sx={{
                      backgroundColor: typeAccount(university?.account?.statusAccount)?.bg,
                      color: typeAccount(university?.account?.statusAccount)?.color,
                    }}
                  />
                </td>
                <td className="flex items-center py-4">
                  {university?.account?.statusAccount === 'PENDING' && (
                    <>
                      <Tooltip title="Duyệt tài khoản">
                        <IconButton onClick={() => handleAction(BackdropType.ApproveConfirmation, university.account.id, university.universityName)}>
                          <CheckBoxIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Từ chối">
                        <IconButton onClick={() => handleAction(BackdropType.RefuseConfirmation, university.account.id, university.universityName)}>
                          <ClearIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {university?.account?.statusAccount === 'ACTIVE' && (
                    <Tooltip title="Khóa tài khoản">
                      <IconButton onClick={() => handleAction(BackdropType.LockConfirmation, university.account.id, university.universityName)}>
                        <LockIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {university?.account?.statusAccount === 'BAN' && (
                    <Tooltip title="Mở khóa tài khoản">
                      <IconButton onClick={() => handleAction(BackdropType.UnlockConfirmation, university.account.id, university.universityName)}>
                        <LockOpenIcon color="success" />
                      </IconButton>
                    </Tooltip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center bg-white p-5">
        <Pagination count={universities?.data.totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
        <p className="text-sm">
          ({universities?.data.currentPage} / {universities?.data.totalPages})
        </p>
      </div>
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
