/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { DatePicker } from 'antd';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ModalAddMoneyDialog from './ModalAddMoney';
import { useGetAllTransactionsQuery, useGetAllWalletsQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import PaginationComponent from '@/components/Common/Pagination';
import { setLoading } from '@/store/slices/global';

const { RangePicker } = DatePicker;

const WalletDashboard = () => {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const dispatch = useDispatch();
  const idAccount = useAppSelector(state => state.user.idAccount);
  const nameAccount = useAppSelector(state => state.user.name);
  const [modalAddMoney, setModalAddMoney] = useState<boolean>(false);

  const [money, setMoney] = useState({
    amount: '',
    bank: '',
  });

  const { data: dataAllWallets } = useGetAllWalletsQuery({ accountId: idAccount }, { refetchOnMountOrArgChange: true });

  const [selectedTransaction, setSelectedTransaction] = useState<number>(1);

  const { data: dataTranSaction, isLoading } = useGetAllTransactionsQuery(
    {
      accountId: dataAllWallets?.data[0].id,
      keyword,
      page: page,
      size: size,
    },
    { refetchOnMountOrArgChange: true }
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

    if (vnp_ResponseCode) {
      if (vnp_ResponseCode === '00') {
        router.push('/wallet/payment-success'); // Chuyển hướng đến trang thanh toán thành công
      } else {
        router.push('/wallet/payment-failed'); // Chuyển hướng đến trang thanh toán thất bại
      }
    }
  }, [router]);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-2">
          <div className="hidden flex-col gap-2 md:flex">
            <h1 className="text-3xl font-semibold leading-[38px]">
              Xin chào, <span className="text-blue-500">{nameAccount}</span>
            </h1>
            <span className="text-base text-[#475467]">Truy cập và quản lý tài khoản và giao dịch của bạn một cách hiệu quả.</span>
          </div>
          <div className="">
            <div className="flex items-center pb-2 text-[#475467]">
              <label className="w-1/2">Từ ngày</label>
              <label className="w-1/2">Đến ngày</label>
            </div>
            <RangePicker className="h-10 w-80" format="DD-MM-YYYY" placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']} />
          </div>
        </div>
        {/* Nap tien */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full items-center justify-between gap-[20px] rounded-md bg-primary-white px-5 py-5 lg:w-3/5">
            <div className="flex w-full  items-center gap-4">
              <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<AccountBalanceWalletOutlinedIcon className="text-primary-main" />}</div>
              <div className="flex w-full flex-col ">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">Tài khoản ví</span>
                    <span className="text-sm text-[#475467]">Số dư khả dụng</span>
                    <span className="text-2xl font-bold">{dataAllWallets?.data[0].amount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                  <button
                    className={
                      'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main bg-primary-main px-4 text-white'
                    }
                    onClick={() => setModalAddMoney(true)}>
                    <AddOutlinedIcon />
                    <span className="hidden md:block">Nạp tiền</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:w-2/5">
            <div className="flex w-full flex-col items-center rounded-md bg-primary-white px-5 py-5">
              <span className="text-2xl font-bold">100</span>
              <span className="text-center">Giao dịch</span>
            </div>
            <div className="flex w-full flex-col items-center rounded-md bg-primary-white px-5 py-5">
              <span className="text-2xl font-bold">100 triệu</span>
              <span className="text-center">Tổng số tiền đã chi</span>
            </div>

            <div className="flex w-full flex-col items-center rounded-md bg-primary-white px-5 py-5">
              <span className="text-2xl font-bold">111 triệu</span>
              <span className="text-center">Tổng số tiền đã nạp vào</span>
            </div>
          </div>
        </div>
        {/* Gợi ý */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="relative flex w-full flex-col rounded-lg border">
              <div className="relative flex-grow rounded-lg bg-[url('/images/big-bg.jpg')] bg-auto bg-right-bottom p-8 text-left text-white">
                <h1 className="mb-2 text-4xl font-bold text-white">
                  Quyền ưu tiên, nâng cấp tài khoản
                  <br />
                  Cùng nhiều quyền hạn khác
                </h1>
                <p className="my-5 text-base text-[#d1d3e0]">
                  Tất cả các quyền hạn có lợi trên, tất cả đều có thể
                  <br />
                  mua và sử dụng tại đây.
                </p>
                <button
                  className={
                    'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main bg-primary-main px-4 text-white'
                  }>
                  <span>Tìm hiểu ngay</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg bg-white p-5 lg:w-1/2">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-xl font-semibold">Báo cáo thu chi</h3>
            </div>
            <LineChart
              series={[
                { curve: 'natural', data: [0, 5, 2, 6, 3, 9.3] },
                { curve: 'natural', data: [6, 3, 7, 9.5, 4, 2] },
              ]}
              width={600}
              height={200}
              margin={{ left: 70 }}
            />
          </div>
        </div>
        {/* Transaction */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full flex-col gap-8 overflow-x-auto rounded-lg rounded-b-md bg-white px-8 py-5 text-[14px]">
            <div>
              <div className="flex justify-between pb-[30px]">
                <h3 className="text-2xl font-semibold">Những giao dịch gần đây</h3>
                <TextField
                  id="filled-search"
                  label="Tìm kiếm giao dịch"
                  type="search"
                  variant="outlined"
                  size="small"
                  onChange={e => debouncedSearch(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
              <div className="tab flex items-center justify-start gap-4">
                <div
                  className={`px-1 pb-3 ${
                    selectedTransaction === 1 ? 'relative bg-gradient-to-r from-[#0179FE] to-[#4893FF] bg-clip-text text-transparent' : 'text-[#667085]'
                  }`}
                  onClick={() => setSelectedTransaction(1)}>
                  <span className="cursor-pointer text-base font-semibold">Tất cả</span>
                  {selectedTransaction === 1 && <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0179FE] to-[#4893FF]"></span>}
                </div>
                <div
                  className={`px-1 pb-3 ${
                    selectedTransaction === 2 ? 'relative bg-gradient-to-r from-[#0179FE] to-[#4893FF] bg-clip-text text-transparent' : 'text-[#667085]'
                  }`}
                  onClick={() => setSelectedTransaction(2)}>
                  <span className="cursor-pointer text-base font-semibold">Tiền vào</span>
                  {selectedTransaction === 2 && <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0179FE] to-[#4893FF]"></span>}
                </div>
                <div
                  className={`px-1 pb-3 ${
                    selectedTransaction === 3 ? 'relative bg-gradient-to-r from-[#0179FE] to-[#4893FF] bg-clip-text text-transparent' : 'text-[#667085]'
                  }`}
                  onClick={() => setSelectedTransaction(3)}>
                  <span className="cursor-pointer text-base font-semibold">Tiền ra</span>
                  {selectedTransaction === 3 && <span className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#0179FE] to-[#4893FF]"></span>}
                </div>
              </div>
            </div>
            <div className="">
              <table className="w-full table-auto">
                <thead className="bg-[#F7F6FE]">
                  <tr>
                    <th className="p-3 py-4 text-left sm:px-3">
                      <span className="min-w-max">STT</span>
                    </th>
                    <th className="cursor-pointer p-3 text-left sm:px-5">
                      <div className="flex items-center">
                        <span className="min-w-max">Mã giao dịch</span>
                      </div>
                    </th>
                    <th className="cursor-pointer p-3 text-left sm:px-5">
                      <div className="flex items-center">
                        <span className="min-w-max">Mô tả</span>
                      </div>
                    </th>
                    <th className="cursor-pointer p-3 text-left sm:px-5">
                      <div className="flex items-center">
                        <span className="min-w-max">Số tiền</span>
                      </div>
                    </th>
                    <th className="cursor-pointer p-3 text-left sm:px-5">
                      <div className="flex items-center">
                        <span className="min-w-max">Thời gian</span>
                      </div>
                    </th>
                    <th className="p-3 text-left sm:px-5">
                      <div className="flex items-center">
                        <span className="min-w-max">Loại giao dịch</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTranSaction?.data.content && dataTranSaction.data.content.length > 0 ? (
                    dataTranSaction?.data.content.map((item, index) => (
                      <tr key={item.id} className={index % 2 !== 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                        <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                        <td className="px-5 py-4">{item.transactionCode}</td>
                        <td className="px-5 py-4">{item.description}</td>
                        <td className="px-5 py-4">{item.amount}</td>
                        <td className="px-5 py-4">{dayjs(item.payDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td className={`px-5 py-4 font-semibold ${item.paymentType === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                          {item.paymentType === 'INCOME' ? 'Giao dịch nạp vào' : 'Giao dịch chi'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-base text-black">
                        <p>Không có dữ liệu nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              <PaginationComponent
                count={dataTranSaction?.data.totalPages}
                page={page}
                onPageChange={(event, value) => setPage(value)}
                size={size}
                totalItem={dataTranSaction?.data.totalElements}
                onSizeChange={value => setSize(value)}
              />
            </div>
          </div>
        </div>
      </div>
      {modalAddMoney && <ModalAddMoneyDialog open={modalAddMoney} money={money} setMoney={setMoney} handleClose={() => setModalAddMoney(false)} />}
    </>
  );
};

export default WalletDashboard;
