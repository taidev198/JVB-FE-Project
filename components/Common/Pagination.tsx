import React from 'react';
import { Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface PaginationWithPageSizeProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const PaginationWithPageSize: React.FC<PaginationWithPageSizeProps> = ({ currentPage, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onItemsPerPageChange(event.target.value as number);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      {/* Dropdown for items per page */}
      <FormControl sx={{ minWidth: 120, marginBottom: '16px' }}>
        <InputLabel>Số lượng</InputLabel>
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

      {/* Pagination */}
      <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" />
    </div>
  );
};

export default PaginationWithPageSize;
