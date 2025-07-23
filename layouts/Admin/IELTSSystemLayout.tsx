import React, { memo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar';
import HeaderIelts from '@/components/Header/HeaderIelts';
import { litsNavbarIELTSSystemAdmin } from '@/router/admin/navbarIELTSSystemRouter';
import { useAppSelector } from '@/store/hooks';
import { Loading } from '@/components/Common/Loading';

const IELTSSystemLayout = memo(({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isLoading = useAppSelector(state => state.global.isLoading);
  const router = useRouter();
  const roleAccount = useAppSelector(state => state.user.roleAccount);
  useEffect(() => {
    // if (roleAccount !== 'ADMIN') {
    //   router.push('/auth/login');
    // }
  }, [roleAccount, router]);
  return (
    <>
      {/* Loading Overlay */}
      {isLoading && <Loading />}

      {/* IELTS Custom Header */}
      <HeaderIelts />

      {/* Main Layout */}
      <div className="flex h-screen pt-[100px]">
        {/* Sidebar */}
        <div className={`${isMobileAndTablet ? 'hidden' : 'block'} h-full w-[19%] overflow-auto bg-primary-white p-[20px]`}>
          <Navbar props={litsNavbarIELTSSystemAdmin} />
        </div>

        {/* Main Content */}
        <div className="h-full w-full overflow-auto bg-[#EEEE] p-0 md:p-[20px] xl:w-[81%] xl:p-[20px]">{children}</div>
      </div>
    </>
  );
});

export default IELTSSystemLayout;
