import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  page: 1,
  size: 10,
  keyword: '',
  status: '',
  universityType: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.size = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setUniversityType: (state, action) => {
      state.universityType = action.payload;
    },
    resetFilters: state => {
      Object.assign(state, initialState);
    },
  },
});

export const { setPage, setPageSize, setKeyword, setStatus, setUniversityType, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
