import { Empty } from 'antd';
import React from 'react';

const PortalEmpty = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Empty description="Không có dữ liệu" />
    </div>
  );
};

export default PortalEmpty;
