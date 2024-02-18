import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channels';

const initialState = {
  messages: [],
  isLoading: false,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadMessages: (state, { payload }) => {
      state.messages = payload;
    },
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    setLoadStatus: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload }) => {
      const filterdMessages = state.messages.filter(
        ({ channelId }) => channelId !== payload.id
      );
      state.messages = filterdMessages;
    });
  },
});

export const { loadMessages, addMessage, setLoadStatus } =
  messagesSlice.actions;
export default messagesSlice.reducer;
