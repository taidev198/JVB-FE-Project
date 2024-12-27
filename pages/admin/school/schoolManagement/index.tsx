import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import DomainIcon from '@mui/icons-material/Domain';
import PhoneIcon from '@mui/icons-material/Phone';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import { useGetDetailSchoolQuery } from '@/services/adminSchoolApi';
import { Button } from '@/components/Common/Button';
import { setLoading } from '@/store/slices/global';
import ImageComponent from '@/components/Common/Image';
import { typeUniversityTitle } from '@/utils/app/const';
const DetailSchoolManagement = () => {
  const dispatch = useDispatch();
  const { data: detailSchool, isLoading } = useGetDetailSchoolQuery(undefined, { refetchOnMountOrArgChange: true });
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);

  return (
    <div className="rounded-2xl bg-white pb-[90px]">
      <div className="p-5">
        <h1 className="mt-5 text-center text-xl font-bold lg:mb-8 lg:mt-0 lg:text-2xl">Thông tin hồ sơ trường </h1>
      </div>

      <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
        <div className="flex items-center gap-[30px] ">
          <div className="rounded-[50%] bg-[#F1F1F1] p-5">
            <ImageComponent
              src={detailSchool?.data?.logoUrl}
              alt={detailSchool?.data?.universityName}
              width={80}
              height={80}
              className="rounded-cover h-20 rounded-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{detailSchool?.data.universityName}</h2>
            <Link href={'#'}>
              <p className="text-primary-gray hover:text-primary-main">Chi tiết thông tin hồ sơ trường</p>
            </Link>
          </div>
        </div>
        <ul className="">
          <li className="mt-5 flex items-center gap-3">
            <DeviceHubIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Mã trường:</span> {detailSchool?.data.universityCode}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmailIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Email:</span> {detailSchool?.data.account.email}
            </div>
          </li>

          <li className="mt-5 flex items-center gap-3">
            <EmojiEventsIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Link Website:</span> {detailSchool?.data.linkWebsite}
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <AccessTimeIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Ngày thành lập:</span> {detailSchool?.data.establishedDate}
            </div>
          </li>

          <li className="mt-4 flex items-center  gap-3 ">
            <CategoryIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Loại trường:</span> {typeUniversityTitle(detailSchool?.data.universityType).title}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <PhoneIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Số điện thoại:</span> {detailSchool?.data.phoneNumber}
            </div>
          </li>
          <li className="mt-5 flex items-center gap-3">
            <DomainIcon sx={{ color: '#757575' }} />
            <div>
              <span className="mr-2 font-semibold">Địa chỉ:</span> {detailSchool?.data.address.houseNumber}, {detailSchool?.data.address.ward.wardName},{' '}
              {detailSchool?.data.address.district.districtName}, {detailSchool?.data.address.province.provinceName}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <div className="mb-auto">
              <InsertCommentIcon sx={{ color: '#757575' }} />
            </div>
            <div>
              <span className="mr-2 font-semibold">Mô tả ngắn gọn:</span>
              {detailSchool?.data.universityShortDescription}
            </div>
          </li>
          <li className="mt-4 flex items-center  gap-3 ">
            <div className="mb-auto">
              <DescriptionIcon sx={{ color: '#757575' }} />
            </div>
            <div>
              <span className="mr-2 font-semibold">Mô tả chi tiết:</span>
              <span dangerouslySetInnerHTML={{ __html: detailSchool?.data.universityDescription ?? '' }}></span>
            </div>
          </li>
        </ul>
        <div className="mt-9 flex items-center justify-center gap-5">
          <Link href={`/admin/school/schoolManagement/UpdateSchoolManagement`}>
            <Button text="Sửa hồ sơ trường" full={true} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default DetailSchoolManagement;
