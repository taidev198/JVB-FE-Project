import { useDispatch } from 'react-redux';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { BackDrop } from '@/components/Common/BackDrop';
import { setBackdrop } from '@/store/slices/global';

import image from '@/assets/images/login.png';

const DetailWorkshop = () => {
  const dispatch = useDispatch();
  return (
    <BackDrop isCenter={true}>
      <div className="p-5 text-[15px] text-black">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold">Workshop 1</h1>
          <IconButton>
            <CloseIcon onClick={() => dispatch(setBackdrop(null))} className="ml-auto" />
          </IconButton>
        </div>
        <div className="mt-2 flex flex-col gap-6 rounded-md border-[1px] border-solid border-[#c2c0c0] p-4 ">
          <p>
            <span className="font-semibold"> Mô tả:</span> <span> Mô tả chi tiết về workshop 1</span>
          </p>
          {/*  */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <p>
              <span className="font-semibold">Thời gian bắt đầu:</span> <span>9:00 20/11/2024</span>
            </p>
            <p>
              <span className="font-semibold">Thời gian kết thúc:</span> <span>18:00 21/11/2024</span>
            </p>
            <p>
              <span className="font-semibold">Số lượng công ty ước tính:</span> <span>10</span>
            </p>
            <p>
              <span className="font-semibold">Địa điểm tổ chức:</span> <span>Hội trường A</span>
            </p>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold"> Mô tả:</span>
            </p>
            <ul className="ml-3 mt-3 flex flex-col gap-1">
              <li>09:00 - Khai mạc</li>
              <li>10:00 - Báo cáo chuyên đề</li>
              <li>12:00 - Nghỉ trưa</li>
              <li>13:30 - Thảo luận nhóm</li>
              <li>16:30 - Tổng kết</li>
            </ul>
          </div>
          {/*  */}
          <div>
            <p>
              <span className="font-semibold">Lĩnh vực:</span>
            </p>
            <ul className="ml-3 mt-3 flex gap-4">
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
            <div className="mt-2 flex justify-evenly gap-4">
              <Image src={image} alt="Workshop" width={70} height={60} className="rounded" />
              <Image src={image} alt="Workshop" width={70} height={60} className="rounded" />
              <Image src={image} alt="Workshop" width={70} height={60} className="rounded" />
              <Image src={image} alt="Workshop" width={70} height={60} className="rounded" />
              <Image src={image} alt="Workshop" width={70} height={60} className="rounded" />
            </div>
          </div>
        </div>
      </div>
    </BackDrop>
  );
};
export default DetailWorkshop;
