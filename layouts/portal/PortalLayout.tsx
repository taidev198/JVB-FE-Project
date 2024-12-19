// layouts/Portal/PortalLayout.tsx
import { FC } from 'react';
import React from 'react';
import PortalHeader from '@/components/Portal/PortalHeader';
import PortalFooter from '@/components/Portal/PortalFooter';
import { ConfigProvider } from 'antd';
interface ProtolLayoutProps {
  children: React.ReactNode;
  type: string;
}

const PortalLayout: FC<ProtolLayoutProps> = ({ children, type }) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#34a853',
          colorText: '#0b0d28',
          fontSize: 16,
          controlPaddingHorizontal: 16,
        },
        components: {
          Select: {
            colorPrimary: '#34a853',
            optionFontSize: 16,
            optionPadding: '5px 15px',
            colorBgContainer: '#F1F1F1',
            hoverBorderColor: '#34a853',
            activeBorderColor: '#34a853',
            multipleItemBg: '#dcdddf',
            optionSelectedColor: '#0b0d28',
            multipleItemColorDisabled: '#7D8087',
          },
          Dropdown: {
            colorBgContainer: '#F1F1F1',
            colorText: '#0b0d28',
            colorTextDisabled: '#7D8087',
            paddingBlock: 8,
          },
          Input: {
            hoverBorderColor: '#34a853',
            activeBorderColor: '#34a853',
            colorText: '#0b0d28',
          },
        },
      }}>
      <PortalHeader type={type} />
      {children}
      <PortalFooter />
    </ConfigProvider>
  </>
);

export default PortalLayout;
