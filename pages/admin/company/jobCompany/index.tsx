import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { TextField, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '@/store/hooks';
import { BackdropType, setBackdrop, setId, setLoading, setName } from '@/store/slices/global';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { useDeleteAllJobCompanyMutation, useDeleteJobCompanyMutation, useGetAllCompanyJobQuery } from '@/services/adminCompanyApi';
import { formatCurrencyVND } from '@/utils/app/format';
import { Button as MyButton } from '@/components/Common/Button';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonUpdate from '@/components/Common/ButtonIcon/ButtonUpdate';
import ButtonDelete from '@/components/Common/ButtonIcon/ButtonDelete';
import PaginationComponent from '@/components/Common/Pagination';
import ButtonCompanyApply from '@/components/Common/ButtonIcon/ButtonCompany';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';

const JobCompany = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [idJob, setIdJob] = useState<number>();
  const dispatch = useDispatch();
  const backdropType = useAppSelector(state => state.global.backdropType);
  const name = useAppSelector(state => state.global.name);
  const [selectedJob, setselectedJob] = useState<number[]>([]);

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );
  const { data: jobCompany, isLoading } = useGetAllCompanyJobQuery(
    {
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
              onClick={() => {
                dispatch(setBackdrop(BackdropType.DeleteConfirmation));
                dispatch(setName(''));
              }}
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
                  checked={selectedJob.length > 0 && jobCompany?.data.content.length > 0}
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
                      <ButtonCompanyApply
                        title={'Danh sách trường học'}
                        href="/admin/company/school-apply-job"
                        onClick={() => {
                          dispatch(setId(item.id));
                        }}
                      />

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
      {backdropType === BackdropType.DeleteConfirmation && <PopupConfirmAction text="Bạn có chắc chắn muốn xóa" name={name} onClick={handleDelete} />}

      {/* Pagination */}
      <PaginationComponent
        count={jobCompany?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={jobCompany?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />
    </>
  );
};
export default JobCompany;
