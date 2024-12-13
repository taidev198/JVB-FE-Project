import { FC } from 'react';
import React from 'react';
import PortalHeader from '@/components/Portal/PortalHeader';
import PortalFooter from '@/components/Portal/PortalFooter';
interface ProtolLayoutProps {
  children: React.ReactNode;
  type: string;
}
const PortalLayout: FC<ProtolLayoutProps> = ({ children }) => {
  return (
    <>
      <PortalHeader />
      {children}
      <PortalFooter />
    </>
  );
};

export default PortalLayout;
