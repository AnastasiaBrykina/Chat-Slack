import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

import routes from '../routes';

const socket = io('http://localhost:3000');

export const addMessage = createAsyncThunk(
  'addMessage',
  async ({ newMessage, headers }) => {
    const res = await axios.post(routes.addMessage(), newMessage, {
      headers,
    });

    return res.data;
  }
);

export const loadMessages = createAsyncThunk(
  'loadMessages',
  async (headers) => {
    const res = await axios.get(routes.messages(), {
      headers,
    });

    return res.data;
  }
);

const initialState = {
  messages: [],
  status: 'initial',
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadNewMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    subscribeSocketMessage: (state, { payload }) => {
      console.log('connected');
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

export const { loadNewMessage, subscribeSocketMessage } = messagesSlice.actions;

export const createMySockedMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;

  if (type === 'messages/subscribeSocketMessage') {
    socket.on('newMessage', (payload) => {
      store.dispatch(loadNewMessage(payload)); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
    });
  }

  return next(action);
};

export default messagesSlice.reducer;
