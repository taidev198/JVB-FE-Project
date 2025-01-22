import React from 'react';
import Link from 'next/link';
import { useGetAllWalletsQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const ChooseWallet: React.FC<Props> = ({ active, setActive }) => {
  const idAccount = useAppSelector(state => state.user.idAccount);

  const { data: dataAllWallets } = useGetAllWalletsQuery({ accountId: idAccount });
  const handleSubmit = () => {
    setActive(active + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="single-items rounded-lg bg-white p-[30px]">
      <div className="card-head mb-8 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Danh sách các ví</h3>
      </div>
      <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2">
        {dataAllWallets?.data?.slice(0, 6).map(wallet => (
          <div key={wallet.id} className="flex w-full items-center gap-[20px] rounded-md border border-[#475467] bg-primary-white p-3">
            <div className="flex flex-col ">
              <span className="text-xl font-bold">Wallet name</span>
              <span>{wallet.walletType}</span>
            </div>
          </div>
        ))}
      </div>
      <Link href={'/wallet/paymentSuccess'}>
        <span className="800px:w-[180px] mt-8 h-[40px] w-full cursor-pointer rounded bg-[#2190ff] text-center text-[#fff]">Tiếp theo</span>
      </Link>
    </form>
  );
};

export default ChooseWallet;
