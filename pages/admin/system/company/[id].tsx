import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCodeIcon from '@mui/icons-material/QrCode';
import WidgetsIcon from '@mui/icons-material/Widgets';

import { useAppSelector } from '@/store/hooks';
import { useGetDetailAccountCompanyQuery } from '@/services/adminSystemApi';
import { typeAccount } from '@/utils/app/const';

const AdminSystemDetailCompany = () => {
  const id = useAppSelector(state => state.global.id);
  const { data: AccountCompanyDetail } = useGetDetailAccountCompanyQuery({ id: Number(id) });
  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-5">
        <Link href={'/admin/system/company'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Thông tin tài khoản công ty </h1>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-6">
            <Image src={AccountCompanyDetail?.data?.logoUrl ?? ''} alt="name" width={75} height={75} className="h-[75px] w-[75px] rounded-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{AccountCompanyDetail?.data.companyName}</h2>
            <Link href={'#'}>
              <p className="text-primary-gray">Chi tiết thông tin công ty</p>
            </Link>
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
          <li className="mt-4 flex items-center  gap-3 ">
            <div>
              <div className="flex items-center gap-3">
                <WidgetsIcon sx={{ color: '#757575' }} />
                <span className="mr-2 font-semibold">Lĩnh vực:</span>
                <Chip
                  label={typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').title}
                  style={{
                    backgroundColor: typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').bg,
                    color: typeAccount(AccountCompanyDetail?.data.account.statusAccount ?? '').color,
                  }}
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminSystemDetailCompany;
