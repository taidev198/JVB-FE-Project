import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import React from 'react'

const detailJobCompany = () => {
    return (
        <div className="rounded-2xl bg-white pb-[90px]">
          {/* Icon */}
          <div className="p-5">
            <Link href={'/admin/company/jobCompany'}>
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            Trở về
          </div>
          <h1 className="mb-12 mt-3 text-center text-2xl font-bold">Chi tiết công việc</h1>
          {/* Info */}
          <div className="mx-auto max-w-[650px] rounded-[10px] border-[1px] border-solid border-[#7D8087] p-7">
            {/* <div className="flex items-center gap-[30px] ">
              <div>
                <Link href={'#'}>
                  <p className="text-primary-gray">Chi tiết nhân viên</p>
                </Link>
              </div>
            </div> */}
            <ul className="">
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Tiêu đề:</span> Lập trình viên Backend
                </div>
              </li>
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Trách nhiệm:</span> 
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>Phát triển và duy trì các API</li>
                    <li>Thiết kế cơ sở dữ liệu và tối ưu hóa truy vấn</li>
                    <li>Tham gia phân tích yêu cầu và đóng góp ý kiến cho dự án</li>
                  </ul>
                </div>
              </li>
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Yêu cầu:</span> 
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>Hiểu biết về Node.js, Python hoặc Java</li>
                    <li>Kiến thức về RESTful API và database (MySQL, MongoDB)</li>
                  </ul>
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Mức lương:</span> 20,000,000 - 30,000,000
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Thời gian làm việc:</span> Thứ 2 - Thứ 6
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Phúc lợi:</span> 
                  <ul className='list-disc pl-5 space-y-2'>
                    <li>Bảo hiểm đầy đủ</li>
                    <li>Làm việc từ xa 2 ngày/ tuần</li>
                    <li>Du lịch công ty hàng năm</li>
                  </ul>
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Cấp bậc:</span> Junior
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Số lượng cần tuyển:</span> 2
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Ngày hết hạn:</span> 2024-12-31
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Loại công việc:</span> Full-time
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
}

export default detailJobCompany