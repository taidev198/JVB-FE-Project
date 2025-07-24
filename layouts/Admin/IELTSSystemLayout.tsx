import React, { memo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar';
import HeaderIelts from '@/components/Header/HeaderIelts';
import { litsNavbarIELTSSystemAdmin, litsNavbarIELTSConnectedSpeech } from '@/router/admin/navbarIELTSSystemRouter';
import { useAppSelector } from '@/store/hooks';
import { Loading } from '@/components/Common/Loading';

const SIDEBAR_WIDTH = '19%';
const HEADER_HEIGHT = 100; // px

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

  // Switch sidebar menu based on route
  const isConnectedSpeech = router.pathname.startsWith('/admin/ielts/connected-speech');
  const sidebarMenu = isConnectedSpeech ? litsNavbarIELTSConnectedSpeech : litsNavbarIELTSSystemAdmin;

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && <Loading />}

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50" style={{ height: HEADER_HEIGHT }}>
        <HeaderIelts />
      </div>

      <div className="flex" style={{ height: '100vh' }}>
        {/* Fixed Sidebar */}
        <div
          className={`${isMobileAndTablet ? 'hidden' : 'block'} fixed left-0 z-40 bg-primary-white p-[20px]`}
          style={{
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            width: SIDEBAR_WIDTH,
            overflowY: 'auto',
          }}
        >
          <Navbar props={sidebarMenu} />
        </div>

        {/* Main Content (scrollable) */}
        <div
          className="bg-[#EEEE] p-0 md:p-[20px] xl:p-[20px]"
          style={{
            marginLeft: isMobileAndTablet ? 0 : SIDEBAR_WIDTH,
            width: isMobileAndTablet ? '100%' : `calc(100% - ${SIDEBAR_WIDTH})`,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            marginTop: HEADER_HEIGHT,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
});

export default IELTSSystemLayout;
