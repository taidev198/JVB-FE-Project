import { createSlice } from '@reduxjs/toolkit';

export interface State {
  idRoom: number;
  namePartnerChat: string;
  receiverId: number;
}

const initialState: State = {
  idRoom: null,
  namePartnerChat: null,
  receiverId: null,
};

export const ChatSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIdRoom: (state, action) => {
      state.idRoom = action.payload;
    },
    setNamePartnerChat: (state, action) => {
      state.namePartnerChat = action.payload;
    },
    setReceiverId: (state, action) => {
      state.receiverId = action.payload;
    },
  },
});

export const { setIdRoom, setNamePartnerChat, setReceiverId } = ChatSlice.actions;

export default ChatSlice.reducer;
