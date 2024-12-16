import { FC } from 'react';
import React from 'react';
import PortalHeader from '@/components/Portal/PortalHeader';
import PortalFooter from '@/components/Portal/PortalFooter';
interface ProtolLayoutProps {
  children: React.ReactNode;
  type: string;
}

const PortalLayout: FC<ProtolLayoutProps> = ({ children, type }) => (
  <>
    <PortalHeader type={type} />
    {children}
    <PortalFooter />
  </>
);

export default PortalLayout;
