import { configureStore } from '@reduxjs/toolkit';

import channelsReducer from './channels';
import messagesReducer from './messages';
import modalsReducer from './modals';
import createMySockedMiddleware from '../middleware';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modals: modalsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(createMySockedMiddleware),
});
