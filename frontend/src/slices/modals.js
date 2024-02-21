/* eslint-disable no-param-reassign */ 
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalInfo: { type: null, channel: null },
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalInfo: (state, { payload }) => {
      state.modalInfo.type = payload.type;
      state.modalInfo.channel = payload.channel;
    },
  },
});

export const { setModalInfo } = modalsSlice.actions;
export default modalsSlice.reducer;
