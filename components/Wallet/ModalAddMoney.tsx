/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React from 'react';
import { useRouter } from 'next/router';
import { Input } from 'antd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { BackDrop } from '@/components/Common/BackDrop';
import { Button } from '@/components/Common/Button';

import { useLazyAddMoneyQuery } from '@/services/adminCompanyApi';

type Props = {
  money: any;
  setMoney: (money: any) => void;
  open: boolean;
  handleClose: (active: any) => void;
};

const ModalAddMoneyDialog: React.FC<Props> = ({ open, money, setMoney, handleClose }) => {
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
    };

  return (
    open && <BackDrop isCenter>
      <div className="max-w-[430px] rounded-md p-6">
        <div className="mb-3">
          <h3 className="font-bold">Nạp tiền</h3>
          <p className="mt-1">Nếu bạn muốn nạp tiền vào ví, hãy nhập số tiền</p>
        </div>
        <Input
            prefix={<AttachMoneyIcon />}
            size="large"
            className="h-10 w-full"
            placeholder="100.000"
            value={money?.amount}
            onChange={(e: any) => setMoney({ ...money, amount: e.target.value })}
        />
        <div className="mt-9 flex items-center gap-5">
          <Button text="Hủy" className="bg-red-600" full={true} onClick={handleClose} />
          <Button text="Tiếp theo" full={true} onClick={handleSubmit} />
        </div>
      </div>
    </BackDrop>
  );
};

export default ModalAddMoneyDialog;
