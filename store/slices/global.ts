import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum BackdropType {
  General = 'GENERAL',
  DeleteConfirmation = 'DELETE_CONFIRMATION',
  ApproveConfirmation = 'Approve_CONFIRMATION',
  RefuseConfirmation = 'Refuse_CONFIRMATION',
  LockConfirmation = 'Lock_CONFIRMATION',
  UnlockConfirmation = 'Unlock_CONFIRMATION',
}

export interface State {
  showSidebar: boolean;
  backdropType: BackdropType | null;
}

const initialState: State = {
  showSidebar: true,
  backdropType: null,
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
  },
});

export const { showSidebar, setBackdrop } = globalSlice.actions;

export default globalSlice.reducer;
