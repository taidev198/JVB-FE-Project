import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import image from '@/assets/images/login.png';

const AdminSchoolDetailWorkshop = () => {
  return (
    <div className="rounded-b-2xl bg-white pb-[90px]">
      {/* Icon */}
      <div className="p-1 sm:p-5">
        <Link href={'/admin/school/workshop'}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        Trở về
      </div>
      <h1 className="mt-3 text-center text-xl font-bold sm:text-2xl">Thông tin chi tiết WorkShop</h1>
      {/* Info */}
      <div className="px-3 py-6 text-[15px] text-black sm:px-20 sm:py-12">
        <div className="flex justify-between">
          <h1 className="text-md font-bold sm:text-lg">Workshop Quản Lý Kinh Tế</h1>
        </div>
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
          {/*  */}
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
            <p>
              <span className="font-semibold">Thời gian bắt đầu:</span> <span>9:00 20/11/2024</span>
            </p>
            <p>
              <span className="font-semibold">Thời gian kết thúc:</span> <span>18:00 21/11/2024</span>
            </p>
            <p>
              <span className="font-semibold">Địa điểm tổ chức:</span> <span>Nhà số 3, Phường Vĩnh Phúc, Quận Ba Đình, Hà Nội</span>
            </p>
            <p>
              <span className="font-semibold">Chương trình:</span> <span>Đào tạo về các phương pháp quản lý trong ngành kinh tế.</span>
            </p>
            <p>
              <span className="font-semibold">Trường học tổ chức:</span> <span>Đại học Hoa Sen</span>
            </p>
            <p>
              <span className="font-semibold">Số lượng công ty ước tính:</span> <span>20</span>
            </p>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold">Lĩnh vực:</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-wrap gap-4">
              <Chip label="Công nghệ" color="primary" />
              <Chip label="Tài chính" color="primary" />
              <Chip label="Khoa học" color="primary" />
            </ul>
          </div>
          {/*  */}
          <div className="flex items-center gap-3">
            <span className="font-semibold">Trạng thái:</span>
            <Chip label="Đã duyệt" color="success" />
          </div>
          {/*  */}
          <div>
            <span className="font-semibold">Hình ảnh:</span>
            <div className="mt-2 flex flex-wrap justify-evenly gap-4">
              <Image src={image} alt="Workshop" width={100} height={90} className="rounded" />
              <Image src={image} alt="Workshop" width={100} height={90} className="rounded" />
              <Image src={image} alt="Workshop" width={100} height={90} className="rounded" />
              <Image src={image} alt="Workshop" width={100} height={90} className="rounded" />
              <Image src={image} alt="Workshop" width={100} height={90} className="rounded" />
            </div>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold">Lịch trình:</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-col gap-1">
              <li>
                <span className="italic ">09:00</span> - Khai mạc
              </li>
              <li>
                <span className="italic ">10:00</span> - Báo cáo chuyên đề
              </li>
              <li>
                <span className="italic ">12:00</span> - Nghỉ trưa
              </li>
              <li>
                <span className="italic ">13:30</span> - Thảo luận nhóm
              </li>
              <li>
                <span className="italic ">16:30</span> - Tổng kết
              </li>
            </ul>
          </div>
          {/* Description */}
          <p>
            <span className="font-semibold"> Mô tả:</span> <span> Hướng dẫn và chia sẻ các kỹ thuật quản lý trong ngành kinh tế tại Đại học Hoa Sen.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminSchoolDetailWorkshop;
