import React, { memo, ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar'; // Sidebar component
import Header from '@/components/Header/Header'; // Header component
import { litsNavbarAdminSchoolRouter } from '@/router/admin/navbarAdminSchoolRouter'; // Navbar routes
import { Loading } from '@/components/Common/Loading'; // Loading component
import { useAppSelector } from '@/store/hooks'; // Redux selector

const AdminSchoolLayout = memo(({ children }: { children: ReactNode }) => {
  const theme = useTheme(); // Get MUI theme
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('lg')); // Check for mobile/tablet
  const isLoading = useAppSelector(state => state.global.isLoading); // Check loading state from Redux

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
