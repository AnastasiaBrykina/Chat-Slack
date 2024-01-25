import { configureStore } from '@reduxjs/toolkit';

import channelsReducer from './channels.js';
import messagesReducer from './messages.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});
