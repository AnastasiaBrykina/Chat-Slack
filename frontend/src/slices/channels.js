import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
const { token } = currentUser;
const headers = { Authorization: `Bearer ${token}` };

export const loadChannels = createAsyncThunk('loadChannels', async () => {
  const res = await axios.get(routes.channelsPath(), {
    headers,
  });

  return res.data;
});

export const addChannel = createAsyncThunk(
  'addChannel',
  async ({ newChannel }) => {
    const res = await axios.post(routes.channelsPath(), newChannel, {
      headers,
    });

    return res.data;
  }
);

export const removeChannel = createAsyncThunk('removeChannel', async (id) => {
  const res = await axios.delete(routes.channelPath(id), {
    headers,
  });

  return res.data;
});

export const renameChannel = createAsyncThunk(
  'renameChannel',
  async ({ editedChannel, id }) => {
    const res = await axios.patch(routes.channelPath(id), editedChannel, {
      headers,
    });

    return res.data;
  }
);

const initialState = {
  channels: [],
  selectedChannel: null,
  status: 'initial',
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    selectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    subscribeSocketChannel: () => {
      console.log('subscribe to new channels!');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChannels.fulfilled, (state, { payload }) => {
        state.channels = payload;
        if (!state.selectedChannel) {
          state.selectedChannel = payload[0];
        }
        state.status = 'finished';
        state.error = null;
      })
      .addCase(loadChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(addChannel.pending, (state, action) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.selectedChannel = payload;
        state.status = 'finished';
        state.error = null;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(removeChannel.pending, (state, action) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, (state, { payload }) => {
        state.status = 'finished';
        state.error = null;
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      .addCase(renameChannel.pending, (state, action) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, { payload }) => {
        state.status = 'finished';
        state.error = null;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { selectedChannel, subscribeSocketChannel } =
  channelsSlice.actions;
export default channelsSlice.reducer;
