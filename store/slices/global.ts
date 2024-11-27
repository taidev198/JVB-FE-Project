import { createSlice } from '@reduxjs/toolkit';

export interface State {
  showSidebar: boolean;
  // lightMode: boolean;
}

const initialState: State = {
  showSidebar: true,
  // lightMode: true,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { showSidebar } = globalSlice.actions;

export default globalSlice.reducer;
