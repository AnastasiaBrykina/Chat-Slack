import { createSlice } from '@reduxjs/toolkit';

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
        state.selectedChannel = payload[0];
      }
    },
    selectedChannel: (state, { payload }) => {
      state.selectedChannel = payload;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      const filteredChannels = state.channels.filter(
        ({ id }) => id !== payload.id
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
