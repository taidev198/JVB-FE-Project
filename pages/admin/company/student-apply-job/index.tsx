import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Checkbox, Chip } from '@mui/material';
import { useApproveStudentJobMutation, useGetAllStudentApplyJobQuery } from '@/services/adminCompanyApi';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';
import { BackdropType, setBackdrop, setId, setLoading } from '@/store/slices/global';
import { resetFilters } from '@/store/slices/filtersSlice';
import { useAppSelector } from '@/store/hooks';
import { statusStudentApplyJob } from '@/utils/app/const';
import ButtonSee from '@/components/Common/ButtonIcon/ButtonSee';
import ButtonAccept from '@/components/Common/ButtonIcon/ButtonAccept';
import PaginationComponent from '@/components/Common/Pagination';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { Button } from '@/components/Common/Button';

const StudentApplyJob = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const { idJob, uId, name, backdropType } = useAppSelector(state => state.global);
  const [idApprove, setIdApprove] = useState<number[] | null>([]);
  const [nameStudent, setNameStudent] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { data: students, isLoading: loadingGetAll } = useGetAllStudentApplyJobQuery(
    { page, size, jorId: idJob, universityId: uId },
    { refetchOnMountOrArgChange: true }
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allStudentIds = students?.data.content.map(student => student.id);
      setIdApprove(allStudentIds ?? []);
    } else {
      setIdApprove([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setIdApprove(prev => (prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]));
  };

  const [approve, { isLoading: loadingApprove }] = useApproveStudentJobMutation();
  const handleApprove = async () => {
    try {
      await approve({ ids: idApprove }).unwrap();
      toast.success('Duyệt thành công');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    } finally {
      dispatch(setBackdrop(null));
      setIdApprove([]);
    }
  };

  useEffect(() => {
    dispatch(setLoading(loadingGetAll || loadingApprove));
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch, loadingGetAll, loadingApprove]);
  return (
    <>
      {/* Header */}
      <div className="rounded-t-md bg-white p-5 pb-5">
        <div className="flex items-center justify-between">
          <h1 className="mb-5 font-bold">Danh sách sinh viên ứng tuyển công việc {name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3"></div>
          <Button
            text="Chấp nhận"
            onClick={() => {
              dispatch(setBackdrop(BackdropType.ApproveConfirmation));
              setNameStudent(null);
            }}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto rounded-lg rounded-b-md bg-white text-[14px]">
          <thead className="bg-white">
            <tr>
              <th className="p-3 sm:px-3 sm:py-4">
                <Checkbox
                  color="primary"
                  checked={idApprove.length > 0 && students?.data.content.length > 0}
                  indeterminate={idApprove.length > 0 && idApprove.length < (students?.data.content || []).length}
                  onChange={handleSelectAll}
                  size="small"
                />
              </th>
              {/* <th className="p-3 py-4 text-left sm:px-3">
                <p className="min-w-max">STT</p>
              </th> */}
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Mã sinh viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Họ tên sinh viên</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Ngày sinh</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Điểm GPA</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Trạng thái</p>
              </th>
              <th className="p-3 text-left sm:px-5 sm:py-4">
                <p className="min-w-max">Hành động</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {students?.data.content.length > 0 ? (
              students?.data.content.map((student, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}`}>
                  <td className="p-3 text-center sm:px-3 sm:py-4">
                    <Checkbox color="primary" checked={idApprove.includes(student.id)} onChange={() => handleSelectStudent(student.id)} size="small" />
                  </td>
                  {/* <td className="p-3 sm:px-5 sm:py-4">
                    <p className="w-fit">{index + 1 + (page - 1) * size}</p>
                  </td> */}
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.student.studentCode}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p> {student.student.fullName}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.student.dateOfBirth.split('-').reverse().join('/')}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <p className="min-w-max">{student.student.gpa}</p>
                  </td>
                  <td className="p-3 sm:px-5 sm:py-4">
                    <Chip
                      label={statusStudentApplyJob(student.status).title}
                      style={{
                        color: `${statusStudentApplyJob(student.status).color}`,
                        background: `${statusStudentApplyJob(student.status).bg}`,
                      }}
                    />
                  </td>
                  <td className=" py-4">
                    <div className="flex items-center gap-2">
                      <ButtonSee
                        href={`/admin/company/student-apply-job/${student?.id}`}
                        onClick={() => {
                          dispatch(setId(student?.id));
                        }}
                      />
                      <ButtonAccept
                        onClick={() => {
                          dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                          setNameStudent(student.student.fullName);
                          setIdApprove(() => [student.id]);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-base">
                  <p>Không có dữ liệu sinh viên nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <PaginationComponent
        count={students?.data.totalPages}
        page={page}
        onPageChange={(event, value) => setPage(value)}
        size={size}
        totalItem={students?.data.totalElements}
        onSizeChange={value => setSize(value)}
      />

      {backdropType === BackdropType.ApproveConfirmation && (
        <PopupConfirmAction
          name={nameStudent}
          text="Đánh giá phù hợp"
          onClick={() => {
            handleApprove();
          }}
        />
      )}
    </>
  );
};
export default StudentApplyJob;
