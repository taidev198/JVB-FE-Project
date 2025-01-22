/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRouter } from 'next/router';
import { Input } from 'antd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useLazyAddMoneyQuery } from '@/services/adminCompanyApi';

type Props = {
  money: any;
  setMoney: (money: any) => void;
  active: number;
  setActive: (active: number) => void;
};

const MoneyData: React.FC<Props> = ({ money, setMoney, active, setActive }) => {
  const router = useRouter();
  const [trigger] = useLazyAddMoneyQuery();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await trigger({ amount: money.amount, bankCode: money.bank }).unwrap();
      if (response.data.url) {
        router.push(response.data.url);
      } else {
        console.error('URL không tồn tại trong phản hồi:', response);
      }
    } catch (error) {
      console.error('Error making payment request:', error);
    }

    setActive(active + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full rounded-lg border border-[#CADBFC] bg-[#FCFCFD] p-8">
        <div className="send-balance">
          <div className="mb-4">
            <span className="text-base">Bạn muốn thêm bao nhiêu?</span>
          </div>
          <div>
            <Input
              prefix={<AttachMoneyIcon />}
              size="large"
              className="h-10 w-full"
              placeholder="100.000"
              value={money?.amount}
              onChange={(e: any) => setMoney({ ...money, amount: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div>
        <input type="submit" value="Tiếp theo" className="800px:w-[180px] mt-8 h-[40px] w-full cursor-pointer rounded bg-[#2190ff] text-center text-[#fff]" />
      </div>
    </form>
  );
};

export default MoneyData;
