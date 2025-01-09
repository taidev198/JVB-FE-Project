import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCodeIcon from '@mui/icons-material/QrCode';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TrafficIcon from '@mui/icons-material/Traffic';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { useAppSelector } from '@/store/hooks';
import { useGetDetailAccountCompanyQuery } from '@/services/adminSystemApi';
import { typeAccount } from '@/utils/app/const';
import ImageComponent from '@/components/Common/Image';
import { Button } from '@/components/Common/Button';
import PopupConfirmAction from '@/components/Common/PopupConfirmAction';
import { BackdropType, setBackdrop } from '@/store/slices/global';
import { useAccountActionsCompanyAdminSystem } from '@/components/Admin/System/SystemCompany/Action';

const AdminSystemDetailCompany = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const id = useAppSelector(state => state.global.id);
  const showBackdrop = useAppSelector(state => state.global.backdropType);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: AccountCompanyDetail } = useGetDetailAccountCompanyQuery({ id: Number(id) }, { refetchOnMountOrArgChange: true });

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
          router.push('/admin/system/company');
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
  return (
    <div className="rounded-2xl bg-white p-3 !pb-20 sm:p-0">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/company'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin tài khoản doanh nghiệp</h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-4 sm:p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-2">
            <ImageComponent src={AccountCompanyDetail?.data?.logoUrl ?? ''} alt="name" width={90} height={90} className="rounded-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-bold lg:text-xl">{AccountCompanyDetail?.data.companyName}</h2>
            {/* <Link href={`/portal/companies/${AccountCompanyDetail?.data?.id}`}>
              <p className="text-primary-gray hover:text-primary-main">Chi tiết thông tin công ty</p>
            </Link> */}
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {AccountCompanyDetail?.data.account.email}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {AccountCompanyDetail?.data.address.houseNumber},{' '}
              {AccountCompanyDetail?.data.address.ward.wardName}, {AccountCompanyDetail?.data.address.district.districtName},{' '}
              {AccountCompanyDetail?.data.address.province.provinceName}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <LocalPhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {AccountCompanyDetail?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <QrCodeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã số thuế:</span> {AccountCompanyDetail?.data.taxCode}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày thành lập:</span> {AccountCompanyDetail?.data.establishedDate}
            </div>
          </li>
          <li className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-3">
              <TrafficIcon sx={{ color: '#757575' }} />
              <span className="mr-2 font-semibold">Trạng thái:</span>
              <Chip
                label={typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').title}
                style={{
                  backgroundColor: typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').bg,
                  color: typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').color,
                }}
              />
            </div>
          </li>
          <li className="mt-4">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <WidgetsIcon sx={{ color: '#757575' }} />
              <p className="mr-2 w-fit font-semibold">Lĩnh vực:</p>
              {AccountCompanyDetail?.data.fields.map(field => (
                <Chip label={field?.fieldName ?? ''} key={field.id} variant="outlined" color="info" />
              ))}
            </div>
          </li>
        </ul>
        <div className="flex justify-end gap-2">
          {AccountCompanyDetail?.data.account.statusAccount === 'PENDING' && (
            <>
              <Button
                text="Từ chối"
                className="bg-red-500"
                onClick={() => {
                  dispatch(setBackdrop(BackdropType.RefuseConfirmation));
                  setSelectedCompanyId(AccountCompanyDetail.data.account.id);
                }}
              />
              <Button
                text="Chấp nhận"
                onClick={() => {
                  dispatch(setBackdrop(BackdropType.ApproveConfirmation));
                  setSelectedCompanyId(AccountCompanyDetail.data.account.id);
                }}
              />
            </>
          )}

          {AccountCompanyDetail?.data.account.statusAccount === 'ACTIVE' && (
            <Button
              text="Khóa"
              onClick={() => {
                dispatch(setBackdrop(BackdropType.LockConfirmation));
                setSelectedCompanyId(AccountCompanyDetail.data.account.id);
              }}
            />
          )}

          {AccountCompanyDetail?.data.account.statusAccount === 'BAN' && (
            <Button
              text="Mở khóa"
              onClick={() => {
                dispatch(setBackdrop(BackdropType.UnlockConfirmation));
                setSelectedCompanyId(AccountCompanyDetail.data.account.id);
              }}
            />
          )}
        </div>
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
  );
};
export default AdminSystemDetailCompany;
