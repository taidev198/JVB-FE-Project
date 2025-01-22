/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AddMoneyOption from '@/components/Wallet/AddMoneyOption';
import MoneyData from '@/components/Wallet/MoneyData';
import ChooseWallet from '@/components/Wallet/ChooseWallet';

const AddMoney = () => {
  const [active, setActive] = useState(1);
  const [money, setMoney] = useState({
    amount: '',
    bank: 'NCB',
  });

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
    <div className="rounded-md bg-primary-white px-5 py-5">
      <div className="w-full p-8">
        <div className="mb-4 flex w-full items-center justify-between">
          <h4 className="text-3xl font-bold">Nạp tiền</h4>
          <div className="cursor-pointer rounded-full bg-slate-200 p-2 text-sm font-semibold">
            <QuestionMarkIcon />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-1/3 max-w-full">
            <AddMoneyOption active={active} setActive={setActive} />
          </div>
          {active === 1 && <ChooseWallet active={active} setActive={setActive} />}
          {active === 2 && <MoneyData active={active} setActive={setActive} money={money} setMoney={setMoney} />}
          {active === 3 && <div>Chọn ví</div>}
        </div>
      </div>
    </div>
  );
};

export default AddMoney;
