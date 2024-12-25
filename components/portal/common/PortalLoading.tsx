import { Spin } from 'antd';
import React from 'react';

const PortalLoading = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default PortalLoading;
