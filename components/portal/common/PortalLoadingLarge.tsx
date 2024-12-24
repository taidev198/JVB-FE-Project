import { Spin } from 'antd';
import React from 'react';

const PortalLoadingLarge = () => {
  return (
    <div className="mp_section_padding mt-[100px] flex w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default PortalLoadingLarge;
