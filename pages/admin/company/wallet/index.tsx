/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React, { useEffect, useMemo, useState } from 'react';
import { Chip, TextField } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Dropdown, Space } from 'antd';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PieArcLabel from './PieChart';
import CreateWalletDialog from './CreateWalletDialog';
import { statusTextJobCompany } from '@/utils/app/const';
import { formatCurrencyVND } from '@/utils/app/format';
import { useGetAllCompanyJobQuery, useGetAllWalletsQuery } from '@/services/adminCompanyApi';
import { setLoading } from '@/store/slices/global';
import PaginationComponent from '@/components/Common/Pagination';
import { useAppSelector } from '@/store/hooks';
import RechargeDialog from '@/components/popupRecharge/RechargeDialog';
type ItemType =
  | { label: React.ReactNode; key: string } // Mục có label và key
  | { type: 'divider'; key: string }; // Mục là divider với key

const Wallet = () => {
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const dispatch = useDispatch();
  const idAccount = useAppSelector(state => state.user.idAccount);
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [openCreateWalletDialog, setOpenCreateWalletDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number>(1);
  const [ isWallet, setIsWallet ] = useState<boolean>(false);
  const router = useRouter();
  const { data: dataAllWallets } = useGetAllWalletsQuery({ accountId: idAccount }, { refetchOnMountOrArgChange: true });

  const debouncedSearch = useMemo(
    () =>
      debounce(value => {
        setKeyword(value);
        setPage(1);
      }, 500),
    []
  );

  const items: ItemType[] = [
    {
      label: <Link href={'#!'} className="min-w-[150px] text-base">Thêm ví mới</Link>,
      key: '0',
    },
    {
      label: <Link href={'#!'} className="min-w-[150px] text-base">Xem tất cả</Link>,
      key: '1',
    },
  ];

  const { data: jobCompany, isLoading } = useGetAllCompanyJobQuery(
    {
      page: page,
      size: size,
      status: null,
      sortBy: 'jobTitle:asc',
      keyword,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (router.query) {
      if (dataAllWallets && dataAllWallets.data && dataAllWallets.data.length > 0) {
        setIsWallet(true);
        setOpenRechargeDialog(true);
      } else {
        setOpenCreateWalletDialog(true);
      }
    }
  }, [router.query, dataAllWallets]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);  

  const handleCreateWalletSubmit = () => {
    setOpenCreateWalletDialog(false);
    setOpenRechargeDialog(true);
  };

  const handleWalletCreationSuccess = () => {
    setOpenCreateWalletDialog(false);
    setOpenRechargeDialog(false);
    setIsWallet(true);
  };

  const handleCancel = () => {
    if (isWallet) {
      router.back()
    } else {
      setOpenRechargeDialog(false);
      setOpenCreateWalletDialog(true);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold leading-[38px]">
            Welcome, <span className="text-blue-500">Admin</span>
          </h1>
          <span className="text-base text-[#475467]">Truy cập và quản lý tài khoản và giao dịch của bạn một cách hiệu quả.</span>
        </div>
        <div className="flex w-full flex-wrap justify-between flex-col lg:flex-row">
          <div className="flex lg:w-2/3 w-full flex-col gap-8">
            <div className="flex w-full items-center justify-between gap-[20px] rounded-md bg-primary-white px-5 py-5">
              <div className="flex w-full  items-center gap-4">
                <div className="w-fit rounded-md bg-[#F1F1F1] p-4">{<AccountBalanceWalletOutlinedIcon className="text-primary-main" />}</div>
                <div className="flex w-full flex-col ">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-base font-semibold">Tài khoản ví plus</span>
                    <Link
                      className={
                        'mp_transition_4 flex h-[40px] cursor-pointer items-center gap-2 rounded-[6px] border-[1px] border-solid border-primary-main bg-primary-main px-4 text-white'
                      }
                      href={'/admin/company/wallet/AddMoney'}>
                      <AddOutlinedIcon />
                      <span>Nạp tiền</span>
                    </Link>
                  </div>
                  <span className="text-sm text-[#475467]">Số dư khả dụng</span>
                  <span className="text-2xl font-bold">
                    {dataAllWallets?.data[0].amount.toLocaleString('vi', { style : 'currency', currency : 'VND' })}
                  </span>
                </div>
              </div>
            </div>
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
                          <span className="min-w-max">Giao dịch</span>
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
                          <span className="min-w-max">Trạng thái</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobCompany?.data.content && jobCompany.data.content.length > 0 ? (
                      jobCompany?.data.content.map((item, index) => (
                        <tr key={item.id} className={index % 2 !== 0 ? 'bg-[#F7F6FE]' : 'bg-primary-white'}>
                          <td className="px-5 py-4"> {index + 1 + (page - 1) * size}</td>
                          <td className="px-5 py-4">{item.jobTitle}</td>
                          <td className="px-5 py-4">
                            {item.salaryType === 'FIXED' ? formatCurrencyVND(item.minSalary) + ' - ' + formatCurrencyVND(item.maxSalary) : 'Thỏa thuận'}
                          </td>
                          <td className="px-5 py-4">{item.expirationDate}</td>
                          <td className="px-5 py-4">
                            <Chip
                              label={statusTextJobCompany(item.status).title}
                              style={{
                                color: `${statusTextJobCompany(item.status).color}`,
                                background: `${statusTextJobCompany(item.status).bg}`,
                              }}
                            />
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
                  count={jobCompany?.data.totalPages}
                  page={page}
                  onPageChange={(event, value) => setPage(value)}
                  size={size}
                  totalItem={jobCompany?.data.totalElements}
                  onSizeChange={value => setSize(value)}
                />
              </div>
            </div>
          </div>
          <div className="flex lg:w-1/3 w-full flex-col mt-8 lg:mt-0 gap-8 px-3">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="flex flex-col w-full items-center rounded-md bg-primary-white px-5 py-5">
                <span className="text-2xl font-bold">100</span>
                <span>Giao dịch</span>
              </div>
              <div className="flex flex-col w-full items-center rounded-md bg-primary-white px-5 py-5">
                <span className="text-2xl font-bold">100.000.000.000đ</span>
                <span>Tổng số tiền đã chi</span>
              </div>

              <div className="flex flex-col w-full items-center rounded-md bg-primary-white px-5 py-5">
                <span className="text-2xl font-bold">111.222.333.444đ</span>
                <span>Tổng số tiền đã nạp vào</span>
              </div>
            </div>
            <div className="single-items rounded-lg bg-white p-[30px]">
              <div className="card-head mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold">Báo cáo tiền đã chi</span>
                <div className="text-sm font-semibold text-[#475467] cursor-pointer hover:bg-slate-200 rounded-full p-2">
                  <Dropdown
                    placement="bottomRight"
                    menu={{
                      items,
                    }}>
                      <a onClick={e => e.preventDefault()}>
                        <Space className="cursor-pointer">
                          <MoreVertIcon />
                        </Space>
                      </a>
                    </Dropdown>
                </div>
              </div>
              <div>
                <PieArcLabel  />
              </div>
            </div>
            <div className="single-items rounded-lg bg-white p-[30px]">
              <div className="card-head mb-8 flex items-center justify-between">
                <span className="text-lg font-semibold">Gợi ý</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="item">Nâng cấp tài khoản</div>
                <div className="item">Đăng tin tuyển dụng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openCreateWalletDialog && (
        <CreateWalletDialog
          open={openCreateWalletDialog}
          onSubmit={handleCreateWalletSubmit}
        />
      )}
      {openRechargeDialog && (
        <RechargeDialog open={openRechargeDialog} onSuccess={handleWalletCreationSuccess} handleCancel={handleCancel} isWallet={isWallet} />
      )}
    </>
  );
};

export default Wallet;
