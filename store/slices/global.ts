import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum BackdropType {
  General = 'GENERAL',
  DeleteConfirmation = 'DELETE_CONFIRMATION',
  UpdateConfirmation = 'UPDATE_CONFIRMATION',
  AddModal = 'ADD_MODAL',
  ApproveConfirmation = 'Approve_CONFIRMATION',
  RefuseConfirmation = 'Refuse_CONFIRMATION',
  LockConfirmation = 'Lock_CONFIRMATION',
  UnlockConfirmation = 'Unlock_CONFIRMATION',
  ModalChat = 'Modal_CHAT',
}

export interface State {
  showSidebar: boolean;
  backdropType: BackdropType | null;
  isLoading: boolean;
  id: number | null;
  name: string | null;
  image: string | null;
}

const initialState: State = {
  showSidebar: true,
  backdropType: null,
  isLoading: false,
  id: null,
  name: null,
  image: null,
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
    setId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
    },
    setName: (state, action: PayloadAction<string | null>) => {
      state.name = action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
  },
});

export const { showSidebar, setBackdrop, setLoading, setId, setName, setImage } = globalSlice.actions;

export default globalSlice.reducer;
