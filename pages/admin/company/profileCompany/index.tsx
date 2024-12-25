
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentsIcon from '@mui/icons-material/Payments';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import AddLinkIcon from '@mui/icons-material/AddLink';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { useGetDetailProfileQuery } from '@/services/adminCompanyApi';
import { Chip, IconButton } from '@mui/material';
import { Button } from '@/components/Common/Button';
import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';

const profileCompany = () => {
  // const [image, setImage] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const { data: profile, isLoading } = useGetDetailProfileQuery();
  console.log(profile);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className="bg-primary-white p-5 rounded-lg">
     <div className="">
      <Link href={'/admin/company/profileCompany'}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      Trở về
      <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Chi tiết công ty </h1>
    </div>
      {/* Block 2 */}
      <div className="grid grid-cols-1 gap-4 rounded-lg bg-primary-white ">

      </div>
      {/* Info */}
      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
      <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-6">
            <Image src={profile?.data?.logoUrl ?? ''} alt="name" width={75} height={75} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.data.companyName}</h2>
            <Link href={'#'}>
              <p className="text-primary-gray hover:text-primary-main">Chi tiết thông tin công ty</p>
            </Link>
          </div>
        </div>

        <ul className="">

          <li className="mt-5 flex items-center gap-3">
          <DeviceHubIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã công ty:</span> {profile?.data.companyCode}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {profile?.data.email}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <AddLinkIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Linkwebsite:</span> <Link href={profile?.data.linkWebsite || '#'}>{profile?.data.linkWebsite}</Link>
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày thành lập:</span> {profile?.data.establishedDate}
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <PhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {profile?.data.phoneNumber}
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <PaymentsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã code:</span> {profile?.data.taxCode}
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <InsertCommentIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mô tả ngắn gọn:</span> {profile?.data.companyShortDescription}
            </div>
          </li>

          <li className="mt-4 flex items-center gap-3 ">
            <div className="mb-auto">
              <DescriptionIcon sx={{ color: '#757575' }} />
            </div>
            <div>
              <span className="mr-2 font-semibold">Mô tả chi tiết:</span>
              {profile?.data.companyDescription}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <AddLocationAltIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {profile?.data.address.houseNumber}, {profile?.data.address.ward.wardName},{' '}
              {profile?.data.address.district.districtName}, {profile?.data.address.province.provinceName}
            </div>
          </li>

          <li className="mt-4 flex  gap-3 ">
            <HorizontalSplitIcon sx={{ color: '#757575' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span className="mr-2 font-semibold" style={{ fontWeight: 'bold' }}>
                Lĩnh vực:
              </span>
              {profile?.data.fields.map(field => (
                <Chip key={field.id} label={field.fieldName} color="primary" variant="outlined" style={{ fontSize: '14px' }} />
              ))}
            </div>
          </li>
        </ul>

        <div className="mt-9 flex items-center gap-5 justify-center">
          <Link href={'/admin/company/profileCompany/updateProfile'}>
            <Button  text="Sửa hồ sơ công ty" full={true} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default profileCompany;


