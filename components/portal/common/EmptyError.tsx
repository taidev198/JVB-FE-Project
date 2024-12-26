import React from 'react';
import { Empty } from 'antd';
const EmptyError = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Empty description="Không có dữ liệu" />
    </div>
  );
};

export default EmptyError;
