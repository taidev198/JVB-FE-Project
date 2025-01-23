/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import CreateWalletDialog from './CreateWalletDialog';
import { useGetAllWalletsQuery } from '@/services/adminCompanyApi';
import { useAppSelector } from '@/store/hooks';
import RechargeDialog from '@/components/popupRecharge/RechargeDialog';
import WalletDashboard from '@/components/Wallet/WalletDashboard';

const Wallet = () => {
  const idAccount = useAppSelector(state => state.user.idAccount);
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [openCreateWalletDialog, setOpenCreateWalletDialog] = useState(false);
  const [ isWallet, setIsWallet ] = useState<boolean>(false);
  const router = useRouter();
  const { data: dataAllWallets } = useGetAllWalletsQuery({ accountId: idAccount }, { refetchOnMountOrArgChange: true });

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
      {openCreateWalletDialog && (
        <CreateWalletDialog
          open={openCreateWalletDialog}
          onSubmit={handleCreateWalletSubmit}
        />
      )}
      {openRechargeDialog && (
        <RechargeDialog open={openRechargeDialog} onSuccess={handleWalletCreationSuccess} handleCancel={handleCancel} isWallet={isWallet} />
      )}
      <WalletDashboard />
    </>
  );
};

export default Wallet;
