import { Pagination } from '@mui/material';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setPageSize, setPage } from '@/store/slices/filtersSlice';

const PaginationComponent = ({ count, page, onPageChange, size, totalItem, totalTitle }) => {
  const dispatch = useDispatch();
  const onSizeChange = value => {
    dispatch(setPageSize(value));
    dispatch(setPage(1));
  };
  return (
    <div className="flex items-center  justify-between rounded-b-lg border border-t border-solid bg-white p-5">
      <p className="text-sm text-[#3e3e3e]">
        Tổng {totalItem} {totalTitle}
      </p>
      <Pagination count={count} page={page} onChange={onPageChange} color="primary" shape="rounded" />
      <Select onChange={onSizeChange} defaultValue={`${size}/trang`} style={{ fontWeight: 600 }}>
        <Select.Option value={5} style={{ fontWeight: 500 }}>
          5/trang
        </Select.Option>
        <Select.Option value={10} style={{ fontWeight: 500 }}>
          10/trang
        </Select.Option>
        <Select.Option value={20} style={{ fontWeight: 500 }}>
          20/trang
        </Select.Option>
        <Select.Option value={30} style={{ fontWeight: 500 }}>
          30/trang
        </Select.Option>
      </Select>
    </div>
  );
};
export default PaginationComponent;
