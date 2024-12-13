import { Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading } from '@/store/slices/global';
import { useGetDetailCompanyJobQuery } from '@/services/adminCompanyApi';

const detailJobCompany = () => {
  const idJobCompany = useAppSelector(state => state.global.id);
  // console.log(idEmployee);
  
  const dispatch = useAppDispatch();
  const { data: jobCompany, isLoading } = useGetDetailCompanyJobQuery({ id: idJobCompany });
  // console.log(employee);
  
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [dispatch, isLoading]);
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
            <ul className="">
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Tiêu đề:</span> {jobCompany?.data.jobTitle}
                </div>
              </li>
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Yêu cầu:</span> {jobCompany?.data.requirements}
                </div>
              </li>
              <li className="mt-5 flex items-center gap-3">
                <div>
                  <span className="mr-2 font-semibold">Hình thức:</span> {jobCompany?.data.jobType}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Thời gian làm việc:</span> {jobCompany?.data.workTime}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Phúc lợi:</span> {jobCompany?.data.benifits}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Cấp bậc:</span> {jobCompany?.data.jobLevel}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Số lượng cần tuyển:</span> {jobCompany?.data.memberOfCandidate}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Ngày hết hạn:</span> {jobCompany?.data.expirationDate}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Trạng Thái:</span> {jobCompany?.data.status}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Loại Lương:</span> {jobCompany?.data.salaryType}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <span className="mr-2 font-semibold">Lương:</span> {jobCompany?.data.maxSalary} - {jobCompany?.data.minSalary}
                </div>
              </li>
              <li className="mt-4 flex items-center  gap-3 ">
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span className="mr-2 font-semibold" style={{ fontWeight: 'bold' }}>Loại công việc:</span>
                    {jobCompany?.data.fields.map((field) => (
                      <Chip
                        key={field.id}
                        label={field.fieldName}
                        color="primary"
                        variant="outlined"
                        style={{ fontSize: '14px' }}
                      />
                   ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
}

export default detailJobCompany