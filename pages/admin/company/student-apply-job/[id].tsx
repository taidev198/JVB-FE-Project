import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Common/Button';
import ImageComponent from '@/components/Common/Image';
import { useApproveStudentJobMutation, useGetDetailStudentApplyJobQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import { genderTitle, StatusStudent } from '@/utils/app/const';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BackdropType, setBackdrop, setLoading, setName } from '@/store/slices/global';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { isErrorWithMessage, isFetchBaseQueryError } from '@/services/helpers';

const StudentDetailApply = () => {
  const id = useAppSelector(state => state.global.id);
  const name = useAppSelector(state => state.global.name);
  const [ids, setIds] = useState<number[]>([]);
  const dispatch = useDispatch();
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const { data: student } = useGetDetailStudentApplyJobQuery({ id }, { refetchOnMountOrArgChange: true });
  const [approve, { isLoading: loadingApprove }] = useApproveStudentJobMutation();

  const handleConfirm = async () => {
    try {
      await approve({ ids }).unwrap();
      toast.success('Duyệt sinh viên thành công');
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg = (error.data as { message?: string })?.message || 'Đã xảy ra lỗi';
        toast.error(errMsg);
      } else if (isErrorWithMessage(error)) {
        toast.error(error.message);
      }
    } finally {
      dispatch(setBackdrop(null));
      setIds([]);
    }
  };

  useEffect(() => {
    dispatch(setLoading(loadingApprove));
  }, [dispatch, loadingApprove]);
  return (
    <div className="text-[#05264e]">
      <div className=" bg-[#f1f5f8]">
        <div className="pt-5">
          <Link href={'/admin/company/student-apply-job'} className="px-10">
            <ArrowBackIcon />
            <span className="pl-1 text-sm">trở về</span>
          </Link>
        </div>
        <section className="py-16">
          <div className="px-10">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <ImageComponent src={student?.data.avatarUrl} alt={student?.data.fullName} width={100} height={100} className="rounded-full" />
                <div>
                  {/* <div className="mb-1 w-fit rounded-md bg-[#0098681a]">
                  <span className="px-4 py-1 text-xs text-[#009868]">Featured</span>
                </div> */}
                  <h4 className="mb-1 text-2xl font-semibold">{student?.data.fullName}</h4>
                  {/* Info */}
                  <div className="flex flex-wrap gap-5">
                    <div className="text-xs text-[#4f5e64]">
                      <i className="fa-solid fa-location-dot me-1"></i>
                      <span className="font-semibold">{student?.data.address.province.provinceName}</span>
                    </div>
                    <div className="text-xs text-[#4f5e64]">
                      <i className="fa-solid fa-cake-candles me-1"></i>
                      <span className="font-semibold">{student?.data.dateOfBirth}</span>
                    </div>
                  </div>
                  {/* Skill */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {student?.data.major.majorFields.map(field => (
                      <p key={field.id} className=" w-fit rounded bg-[#dce2e7] px-4 py-[2px] text-xs font-medium text-[#4f5e64]">
                        {field.fieldName}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 md:mt-0">
                <Button
                  text="Duyệt hồ sơ"
                  icon={<i className="fa-solid fa-bookmark"></i>}
                  onClick={() => {
                    dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                    dispatch(setName(student?.data.fullName));
                    setIds([student?.data.id]);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="grid grid-cols-12 gap-5 bg-white px-10 pb-10 pt-6">
        <div className="col-span-12 md:col-span-8">
          <div className="rounded-lg border border-dashed p-4">
            <h5 className="px-4 text-xl font-semibold">Tất cả thông tin</h5>
            <div className="grid grid-cols-1 gap-6 py-4 sm:grid-cols-2">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-envelope-open-text text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.email}</h5>
                  <p className="text-xs">Email</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-phone-volume text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.phoneNumber}</h5>
                  <p className="text-xs">Số điện thoại</p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-regular fa-user text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{genderTitle(student?.data.gender)}</h5>
                  <p className="text-xs">Giới tính</p>
                </div>
              </div>

              {/* birthday */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-cake-candles text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.dateOfBirth}</h5>
                  <p className="text-xs">Ngày sinh</p>
                </div>
              </div>

              {/* GPA */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-layer-group text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.gpa}</h5>
                  <p className="text-xs">Điểm GPA</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-user-graduate text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{StatusStudent(student?.data.studentStatus)}</h5>
                  <p className="text-xs">Tình trạng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="col-span-12 md:col-span-4">
          <div className="rounded-lg border border-dashed p-4">
            <h5 className="px-4 text-xl font-semibold">Chuyên môn</h5>
            <div className="grid grid-cols-1 gap-6 py-4">
              {/* School */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-building-circle-check text-primary text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.major.faculty.university.universityName}</h5>
                  <p className="text-xs">Trường học</p>
                </div>
              </div>

              {/* Major */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-brands fa-dribbble text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.major.majorName}</h5>
                  <p className="text-xs">Chuyên ngành</p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-4">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-[#f4f5f7]">
                  <i className="fa-solid fa-file-invoice text-primary text-[22px] text-[#96aab7]"></i>
                </div>
                <div>
                  <h5 className="text-[15px] font-semibold text-[#05264e]">{student?.data.major.faculty.facultyName}</h5>
                  <p className="text-xs">Khoa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showBackdrop === BackdropType.ApproveConfirmation && <PopupConfirmAction text="Duyệt hồ sơ của" name={name} onClick={handleConfirm} />}
    </div>
  );
};
export default StudentDetailApply;
