import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface State {
  message: string | null;
  type: string;
}

const initialState: State = {
  message: null,
  type: 'success',
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<{ message: string; type?: string }>) => {
      const { message, type = 'success' } = action.payload;
      state.message = message;
      state.type = type;
    },
    clearToast: () => {
      return initialState;
    },
  },
});

export const { setToast, clearToast } = toastSlice.actions;

export default toastSlice.reducer;
