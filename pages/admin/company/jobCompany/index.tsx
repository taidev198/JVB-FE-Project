import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Checkbox } from '@mui/material';
import Link from 'next/link';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { Button, Button as MyButton } from '@/components/Common/Button';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { BackDrop } from '@/components/Common/BackDrop';
import { useDeleteAllJobCompanyMutation, useDeleteJobCompanyMutation, useGetAllCompanyJobQuery } from '@/services/adminCompanyApi';
import { resetFilters, setKeyword, setPage } from '@/store/slices/filtersSlice';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { formatCurrencyVND } from '@/utils/app/format';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import PaginationComponent from '@/components/Common/Pagination';

const JobCompany = () => {
  const [idJob, setIdJob] = useState<number>();
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const { page, keyword, size, status } = useAppSelector(state => state.filter);
  const [selectedJob, setselectedJob] = useState<number[]>([]);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        dispatch(setKeyword(value));
        dispatch(setPage(1));
      }, 500),
    [dispatch]
  );
  const { data: jobCompany, isLoading } = useGetAllCompanyJobQuery(
    {
      status: status,
      page: page,
      size: size,
      keyword,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteOne, { isLoading: isLoadingOne }] = useDeleteJobCompanyMutation();
  const [deleteMultiple, { isLoading: isLoadingMultiple }] = useDeleteAllJobCompanyMutation();
  const handleDelete = async () => {
    try {
      if (selectedJob.length > 0) {
        await deleteMultiple({ ids: selectedJob }).unwrap();
        toast.success('Các công việc đã được xóa thành công');
      } else {
        await deleteOne({ id: idJob }).unwrap();
        toast.success('Công việc đã được xóa thành công');
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
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allJob = jobCompany?.data.content.map(job => job.id);
      setselectedJob(allJob ?? []);
    } else {
      setselectedJob([]);
    }
  };
  const handleSelectJob = (id: number) => {
    setselectedJob(prev => (prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]));
  };

  useEffect(() => {
    dispatch(setLoading(isLoading || isLoadingOne || isLoadingMultiple));
    return () => {
      dispatch(resetFilters());
    };
  }, [isLoading, dispatch, isLoadingMultiple, isLoadingOne]);

  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <h1 className="mb-5 font-bold">Doanh sách công việc</h1>
        <div className="flex items-center justify-between gap-3 ">
          <TextField
            id="filled-search"
            label="Tìm kiếm tên công việc"
            type="search"
            variant="outlined"
            size="small"
            onChange={e => debouncedSearch(e.target.value)}
            className="w-[250px]"
          />
          <div className="flex items-center gap-5">
            <Link href={'/admin/company/jobCompany/AddJob'}>
              <MyButton type="submit" icon={<AddIcon />} text="Thêm mới" />
            </Link>
            <MyButton
              type="submit"
              text="Xóa công việc "
              className="bg-red-custom"
              onClick={() => dispatch(setBackdrop(BackdropType.DeleteConfirmation))}
              disabled={!selectedJob.length}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={selectedJob.length === jobCompany?.data.content.length}
                  indeterminate={selectedJob.length > 0 && selectedJob.length < (jobCompany?.data.content || []).length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-5 py-4 text-left">STT</th>
              <th className="px-5 py-4 text-left">Tên công việc</th>
              <th className="px-5 py-4 text-left">Mức lương</th>
              <th className="px-5 py-4 text-left">Thời hạn</th>
              <th className="px-5 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {jobCompany?.data.content && jobCompany.data.content.length > 0 ? (
              jobCompany?.data.content.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Checkbox color="primary" checked={selectedJob.includes(item.id)} onChange={() => handleSelectJob(item.id)} />
                  </td>
                  <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                  <td className="px-5 py-4">{item.jobTitle}</td>
                  <td className="px-5 py-4">
                    {item.salaryType === 'FIXED' ? formatCurrencyVND(item.maxSalary) + ' - ' + formatCurrencyVND(item.minSalary) : 'Thỏa thuận'}
                  </td>
                  <td className="px-5 py-4">{item.expirationDate}</td>
                  <td className=" py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee href={`/admin/company/jobCompany/${item.id}`} onClick={() => dispatch(setId(item.id))} />

                      <ButtonUpdate href={`/admin/company/jobCompany/update/${item.id}`} onClick={() => dispatch(setId(item.id))} />

                      <ButtonDelete
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                          setIdJob(item.id);
                          dispatch(setName(item.jobTitle));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base text-black">
                  <p>Không có dữ liệu nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Xóa Nhân Viên */}
      {backdropType === BackdropType.DeleteConfirmation && (
        <BackDrop isCenter={true}>
          <div className="max-w-[400px] rounded-md p-6">
            <h3 className="font-bold">Bạn có chắc chắn muốn xóa {name}?</h3>
            <p className="mt-1">Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn sinh viên khỏi hệ thống.</p>
            <div className="mt-9 flex items-center gap-5">
              <Button text="Hủy" className="bg-red-600" full={true} onClick={() => dispatch(setBackdrop(null))} />
              <Button text="Xác nhận" className="bg-green-600" onClick={handleDelete} full={true} />
            </div>
          </div>
        </BackDrop>
      )}

      {/* Pagination */}
      <PaginationComponent
        count={jobCompany?.data.currentPage}
        page={page}
        onPageChange={(event, value) => dispatch(setPage(value))}
        size={size}
        totalItem={jobCompany?.data.totalElements}
      />
    </>
  );
};
export default JobCompany;
