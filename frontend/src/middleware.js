import { io } from 'socket.io-client';

import { addMessage } from './slices/messages';
import { addChannel, removeChannel, renameChannel } from './slices/channels';

const socket = io();

const createMySockedMiddleware = (store) => {
  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel(payload));
  });
  return (next) => (action) => next(action);
};

export { socket };
export default createMySockedMiddleware;
