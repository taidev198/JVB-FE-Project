import { createSlice } from '@reduxjs/toolkit';

export interface State {
  showSidebar: boolean;
  lightMode: boolean;
}

const initialState: State = {
  showSidebar: false,
  lightMode: true,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
});

export default globalSlice.reducer;
