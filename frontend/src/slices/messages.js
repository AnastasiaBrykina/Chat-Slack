import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import routes from '../routes';

const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
const { token } = currentUser;
const headers = { Authorization: `Bearer ${token}` };

export const addMessage = createAsyncThunk(
  'addMessage',
  async ({ newMessage }) => {
    const res = await axios.post(routes.messagesPath(), newMessage, {
      headers,
    });

    return res.data;
  }
);

export const loadMessages = createAsyncThunk('loadMessages', async () => {
  const res = await axios.get(routes.messagesPath(), {
    headers,
  });

  return res.data;
});

const initialState = {
  messages: [],
  status: 'initial',
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    subscribeSocketMessage: () => {
      console.log('subscribe to new messages!');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMessage.pending, (state) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state) => {
        state.status = 'finished';
        state.error = null;
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(loadMessages.fulfilled, (state, { payload }) => {
        state.messages = payload;
        state.status = 'finished';
        state.error = null;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { subscribeSocketMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
