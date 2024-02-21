/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { getCurrentUserName } from '../authData';

const initialState = {
  channels: [],
  selectedChannel: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    loadChannels: (state, { payload }) => {
      state.channels = payload;
      if (!state.selectedChannel) {
        const [defaultChannel] = payload;
        state.selectedChannel = defaultChannel;
      }
    },
    selectedChannel: (state, { payload }) => {
      state.selectedChannel = payload;
    },
    addChannel: (state, { payload }) => {
      const { username } = payload;
      state.channels.push(payload);
      if (username === getCurrentUserName()) {
        state.selectedChannel = payload;
      }
    },
    removeChannel: (state, { payload }) => {
      const filteredChannels = state.channels.filter(
        ({ id }) => id !== payload.id,
      );
      state.channels = filteredChannels;
    },
    renameChannel: (state, { payload }) => {
      const { name, id } = payload;
      const channel = state.channels.find((chanel) => chanel.id === id);
      channel.name = name;
    },
  },
});

export const {
  loadChannels,
  selectedChannel,
  addChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
