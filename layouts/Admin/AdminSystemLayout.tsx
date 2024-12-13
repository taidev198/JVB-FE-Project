import React, { memo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar';
import Header from '@/components/Header/Header';
import { litsNavbarSystemAdmin } from '@/router/admin/navbarSystemRouter';
import { useAppSelector } from '@/store/hooks';
import { Loading } from '@/components/Common/Loading';

const AdminSystemLayout = memo(({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isLoading = useAppSelector(state => state.global.isLoading);
  const roleAccount = useAppSelector(state => state.user.roleAccount);
  useEffect(() => {
    if (roleAccount !== 'ADMIN') {
      router.push('/auth/login');
      toast.error('Bạn không có quyền vào admin');
    }
  }, [roleAccount, router]);
  return (
    <>
      {isLoading && <Loading />}
      <Header isAdmin={true} />
      <div className={`${!isMobileAndTablet ? 'flex' : ''}`}>
        {isMobileAndTablet ? (
          <div className={`hidden h-screen overflow-auto`}>
            <Navbar props={litsNavbarSystemAdmin} />
          </div>
        ) : (
          <div className={`h-screen w-[19%] overflow-auto bg-primary-white p-[20px]`}>
            <Navbar props={litsNavbarSystemAdmin} />
          </div>
        )}
        <div className="h-screen overflow-auto bg-[#EEEE] p-0 md:p-[20px] xl:w-[81%] xl:p-[20px]">{children}</div>
      </div>
    </>
  );
});

export default AdminSystemLayout;
