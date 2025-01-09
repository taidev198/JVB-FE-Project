import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrafficIcon from '@mui/icons-material/Traffic';
import { useRouter } from 'next/router';

import { useAppSelector } from '@/store/hooks';
import { useGetDetailAccountSchoolQuery } from '@/services/adminSystemApi';
import { typeAccount, typeUniversityTitle } from '@/utils/app/const';
import { BackdropType, setBackdrop, setLoading } from '@/store/slices/global';
import ImageComponent from '@/components/Common/Image';
import { Button } from '@/components/Common/Button';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { useAccountActionsCompanyAdminSystem } from '@/components/Admin/System/SystemCompany/Action';

const AdminSystemDetailSchool = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const id = useAppSelector(state => state.global.id);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const router = useRouter();

  const { data, isLoading } = useGetDetailAccountSchoolQuery({ id });

  const { approveAccount, rejectAccount, lockAccount, unlockAccount } = useAccountActionsCompanyAdminSystem();
  const handleConfirmAction = () => {
    if (selectedCompanyId !== null) {
      switch (showBackdrop) {
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
          router.push('/admin/system/school');
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
    }
  };
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
  return (
    <div className="rounded-2xl bg-white p-3 !pb-20 sm:p-0">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/school'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin tài khoản trường đại học </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-4 sm:p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-2">
            <ImageComponent src={data?.data.logoUrl} width={90} height={90} className="rounded-full" alt={data?.data.universityName} />
          </div>
          <div>
            <h2 className="text-lg font-bold lg:text-xl">{data?.data.universityName}</h2>
            <Link href={`/portal/schools/${data?.data.id}`}>
              <p className="text-primary-gray hover:text-primary-main">Xem chi tiết</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {data?.data.account.email}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {data?.data.address.houseNumber}, {data?.data.address.ward.wardName},
              {data?.data.address.district.districtName}, {data?.data.address.province.provinceName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <SchoolIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Loại trường:</span> {typeUniversityTitle(data?.data.universityType ?? '').title}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {data?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <div>
              <div className="flex items-center gap-3">
                <TrafficIcon sx={{ color: '#757575' }} />
                <span className="mr-2 font-semibold">Trạng thái:</span>
                <Chip
                  label={typeAccount(data?.data.account?.statusAccount ?? '').title}
                  style={{
                    backgroundColor: typeAccount(data?.data.account?.statusAccount ?? '').bg,
                    color: typeAccount(data?.data.account?.statusAccount ?? '').color,
                  }}
                />
              </div>
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <GroupsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng sinh viên:</span> {data?.data.numberOfStudents}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số lượng sinh viên đã tốt nghiệp:</span> {data?.data.numberOfGraduates}
            </div>
          </li>
          <li className="mt-4 flex gap-3 ">
            <LightbulbIcon sx={{ color: '#757575' }} />
            <div className="flex">
              <p className="mr-2 min-w-fit font-semibold">Mô tả:</p>
              <p>
                <span dangerouslySetInnerHTML={{ __html: data?.data.universityDescription || '' }} />
              </p>
            </div>
          </li>
        </ul>
        <div className="flex justify-end gap-2">
          {data?.data.account.statusAccount === 'PENDING' && (
            <>
              <Button
                text="Từ chối"
                className="bg-red-500"
                onClick={() => {
                  dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                  setSelectedCompanyId(data.data.account.id);
                }}
              />
              <Button
                text="Chấp nhận"
                onClick={() => {
                  dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                  setSelectedCompanyId(data.data.account.id);
                }}
              />
            </>
          )}

          {data?.data.account.statusAccount === 'ACTIVE' && (
            <Button
              text="Khóa"
              onClick={() => {
                dispatch(setBackdrop(BackdropType.LockConfirmation));
                setSelectedCompanyId(data.data.account.id);
              }}
            />
          )}

          {data?.data.account.statusAccount === 'BAN' && (
            <Button
              text="Mở khóa"
              onClick={() => {
                dispatch(setBackdrop(BackdropType.UnlockConfirmation));
                setSelectedCompanyId(data.data.account.id);
              }}
            />
          )}
        </div>

        {showBackdrop && (
          <PopupConfirmAction
            text={
              showBackdrop === BackdropType.ApproveConfirmation
                ? 'Duyệt'
                : showBackdrop === BackdropType.RefuseConfirmation
                ? 'Từ chối'
                : showBackdrop === BackdropType.LockConfirmation
                ? 'Khóa'
                : showBackdrop === BackdropType.UnlockConfirmation
                ? 'Mở khóa'
                : ''
            }
            name={`tài khoản doanh nghiệp ${name}`}
            onClick={handleConfirmAction}
          />
        )}
      </div>
    </div>
  );
};
export default AdminSystemDetailSchool;
