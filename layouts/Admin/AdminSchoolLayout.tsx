import { useRouter } from 'next/router';
import React, { memo, ReactNode, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar';
import Header from '@/components/Header/Header';
import { litsNavbarAdminSchoolRouter } from '@/router/admin/navbarAdminSchoolRouter';
import { Loading } from '@/components/Common/Loading';
import { useAppSelector } from '@/store/hooks';

const AdminSchoolLayout = memo(({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isLoading = useAppSelector(state => state.global.isLoading);
  const router = useRouter();
  const roleAccount = useAppSelector(state => state.user.roleAccount);
  useEffect(() => {
    if (roleAccount !== 'UNIVERSITY') {
      router.push('/auth/login');
    }
  }, [roleAccount, router]);
  return (
    <>
      {/* Loading Overlay */}
      {isLoading && <Loading />}

      {/* Header */}
      <Header isAdmin={true} />

      {/* Main Layout */}
      <div className="flex h-screen pt-[100px]">
        {/* Sidebar */}
        <div className={`${isMobileAndTablet ? 'hidden' : 'block'} h-full w-[19%] overflow-auto bg-primary-white p-[20px]`}>
          <Navbar props={litsNavbarAdminSchoolRouter} />
        </div>

        {/* Main Content */}
        <div className="h-full w-full overflow-auto bg-[#EEEE] p-0 md:p-[20px] xl:w-[81%] xl:p-[20px]">{children}</div>
      </div>
    </>
  );
});

export default AdminSchoolLayout;
