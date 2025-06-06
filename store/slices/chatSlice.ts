import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  idRoom: number;
  namePartnerChat: string;
  receiverId: number;
  incommingCallFrom: string;
  incommingCallOffer: any;
  isVideoCallActive: boolean;
  videoCallWindowId: string | null;
}

const initialState: ChatState = {
  idRoom: undefined,
  namePartnerChat: '',
  receiverId: undefined,
  incommingCallFrom: '',
  incommingCallOffer: null,
  isVideoCallActive: false,
  videoCallWindowId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIdRoom: (state, action: PayloadAction<number>) => {
      state.idRoom = action.payload;
    },
    setNamePartnerChat: (state, action: PayloadAction<string>) => {
      state.namePartnerChat = action.payload;
    },
    setReceiverId: (state, action: PayloadAction<number>) => {
      state.receiverId = action.payload;
    },
    setIncommingCallFrom: (state, action: PayloadAction<string>) => {
      state.incommingCallFrom = action.payload;
    },
    setIncommingCallOffer: (state, action: PayloadAction<any>) => {
      state.incommingCallOffer = action.payload;
    },
    setVideoCallActive: (state, action: PayloadAction<boolean>) => {
      state.isVideoCallActive = action.payload;
    },
    setVideoCallWindowId: (state, action: PayloadAction<string | null>) => {
      state.videoCallWindowId = action.payload;
    },
  },
});

export const {
  setIdRoom,
  setNamePartnerChat,
  setReceiverId,
  setIncommingCallFrom,
  setIncommingCallOffer,
  setVideoCallActive,
  setVideoCallWindowId,
} = chatSlice.actions;

export default chatSlice.reducer;
