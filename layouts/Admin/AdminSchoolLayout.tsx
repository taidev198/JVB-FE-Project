import { ReactNode } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Sidebar';
import Header from '@/components/Header/Header';
import { litsNavbarAdminSchoolRouter } from '@/router/admin/navbarAdminSchoolRouter';

const AdminSchoolLayout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <>
      <Header isAdmin={true} />
      <div className={`${!isMobileAndTablet ? 'flex' : ''}`}>
        {isMobileAndTablet ? (
          <div className={`hidden`}>
            <Navbar props={litsNavbarAdminSchoolRouter} />
          </div>
        ) : (
          <div className={`w-[19%] bg-primary-white p-[30px]`}>
            <Navbar props={litsNavbarAdminSchoolRouter} />
          </div>
        )}
        <div className="bg-[#EEEE] p-0 md:p-[20px] xl:w-[81%] xl:p-[20px]">{children}</div>
      </div>
    </>
  );
};

export default AdminSchoolLayout;
