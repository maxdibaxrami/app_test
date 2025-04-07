// src/store/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  senderId: string;
  recipientId: string;
  content?: string;
  mediaUrl?: string;
  timestamp: string;
}

interface ChatState {
  isActive: boolean;
  isWaiting: boolean;
  room: string;
  partnerId: string;
  messages: Message[];
  chatCancelledMessage: string;
}

const initialState: ChatState = {
  isActive: false,
  isWaiting: false,
  room: '',
  partnerId: '',
  messages: [],
  chatCancelledMessage: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    startWaiting(state) {
      state.isWaiting = true;
    },
    chatMatched(state, action: PayloadAction<{ room: string; partnerId: string }>) {
      state.room = action.payload.room;
      state.partnerId = action.payload.partnerId;
      state.isActive = true;
      state.isWaiting = false;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    cancelChat(state, action: PayloadAction<{ chatCancelledMessage: string }>) {
      state.chatCancelledMessage = action.payload.chatCancelledMessage;
      state.isActive = false;
      state.room = '';
      state.partnerId = '';
      state.messages = [];
      state.isWaiting = false;
    },
    resetChat(state) {
      state.isActive = false;
      state.isWaiting = false;
      state.room = '';
      state.partnerId = '';
      state.messages = [];
      state.chatCancelledMessage = '';
    },
  },
});

export const { startWaiting, chatMatched, addMessage, cancelChat, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
