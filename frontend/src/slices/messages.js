import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channels';

const initialState = {
  messages: [],
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

export const { loadMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
