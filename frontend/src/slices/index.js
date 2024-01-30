import { configureStore } from '@reduxjs/toolkit';

import channelsReducer from './channels';
import messagesReducer, { createMySockedMiddleware } from './messages';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createMySockedMiddleware),
});
