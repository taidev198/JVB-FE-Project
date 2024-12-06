import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum BackdropType {
  General = 'GENERAL',
  DeleteConfirmation = 'DELETE_CONFIRMATION',
  AddModal = 'ADD_MODAL',
  ApproveConfirmation = 'Approve_CONFIRMATION',
  RefuseConfirmation = 'Refuse_CONFIRMATION',
  LockConfirmation = 'Lock_CONFIRMATION',
  UnlockConfirmation = 'Unlock_CONFIRMATION',
}

export interface State {
  showSidebar: boolean;
  backdropType: BackdropType | null;
  isLoading: boolean;
}

const initialState: State = {
  showSidebar: true,
  backdropType: null,
  isLoading: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
    setBackdrop: (state, action: PayloadAction<BackdropType | null>) => {
      state.backdropType = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { showSidebar, setBackdrop, setLoading } = globalSlice.actions;

export default globalSlice.reducer;
