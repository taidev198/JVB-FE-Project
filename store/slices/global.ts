import { createSlice } from '@reduxjs/toolkit';

export interface State {
  showSidebar: boolean;
  showBackdrop: boolean;
}

const initialState: State = {
  showSidebar: true,
  showBackdrop: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
    toggleBackdrop: state => {
      state.showBackdrop = !state.showBackdrop;
    },
  },
});

export const { showSidebar, toggleBackdrop } = globalSlice.actions;

export default globalSlice.reducer;
