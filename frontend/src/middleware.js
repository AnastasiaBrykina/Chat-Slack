import { io } from 'socket.io-client';

import { loadMessages } from './slices/messages';
import { loadChannels } from './slices/channels';

const socket = io();

const createMySockedMiddleware = (store) => (next) => (action) => {
  const { type } = action;

  if (type === 'messages/subscribeSocketMessage') {
    socket.on('newMessage', (payload) => {
      store.dispatch(loadMessages()); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
    });
  }

  if (type === 'channels/subscribeSocketChannel') {
    socket.on('newChannel', (payload) => {
      store.dispatch(loadChannels());
    });
    socket.on('removeChannel', (payload) => {
      store.dispatch(loadChannels());
      store.dispatch(loadMessages());
    });
    socket.on('renameChannel', (payload) => {
      store.dispatch(loadChannels());
    });
  }

  return next(action);
};

export default createMySockedMiddleware;
