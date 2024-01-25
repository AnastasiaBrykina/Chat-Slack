import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  selectedChannel: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: (state, action) => {
      state.channels = action.payload;
    },
    selectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
  },
});

export const { addChannels, selectedChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
