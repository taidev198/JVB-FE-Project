import React, { FC } from 'react';
import { Pagination } from '@mui/material';
import { Select } from 'antd';

interface PaginationComponentProps {
  count: number;
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  size: number;
  onSizeChange: (size: number) => void;
  totalItem: number;
}

const PaginationComponent: FC<PaginationComponentProps> = React.memo(({ count, page, onPageChange, size, onSizeChange, totalItem }) => {
  return (
    <div className="flex items-center justify-between rounded-b-lg border border-t border-solid bg-white p-5">
      <div className="flex items-center gap-2">
        <p className="text-[12px] text-[#3e3e3e] sm:text-sm">Trên mỗi trang</p>
        <Select onChange={value => onSizeChange(Number(value))} defaultValue={`${size}`} style={{ fontWeight: 600 }}>
          <Select.Option value={5} style={{ fontWeight: 500 }}>
            5
          </Select.Option>
          <Select.Option value={10} style={{ fontWeight: 500 }}>
            10
          </Select.Option>
          <Select.Option value={20} style={{ fontWeight: 500 }}>
            20
          </Select.Option>
          <Select.Option value={30} style={{ fontWeight: 500 }}>
            30
          </Select.Option>
          <Select.Option value={50} style={{ fontWeight: 500 }}>
            50
          </Select.Option>
        </Select>
        <p className="text-[12px] text-[#3e3e3e] sm:text-sm">
          {totalItem > 0 ? `${(page - 1) * size + 1} - ${Math.min(page * size, totalItem)} trên ${totalItem}` : '0 trên 0'}
        </p>
      </div>
      <Pagination count={count === 0 ? 1 : count} page={page} onChange={onPageChange} color="primary" shape="rounded" />
    </div>
  );
});

export default PaginationComponent;
