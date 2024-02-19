import axios from 'axios';

import routes from './routes';
import { getAuthHeader } from './authData';

const restApi = {
  loadChannels: () => axios.get(routes.channelsPath(), {
    headers: getAuthHeader(),
  }),
  loadMessages: () => axios.get(routes.messagesPath(), {
    headers: getAuthHeader(),
  }),
  login: (values) => axios.post(routes.loginPath(), values),
  signup: (username, password) => axios.post(routes.signupPath(), {
    username,
    password,
  }),
  newChannel: (newChannel) => axios.post(routes.channelsPath(), newChannel, {
    headers: getAuthHeader(),
  }),
  removeChannel: (id) => axios.delete(routes.channelPath(id), { headers: getAuthHeader() }),
  renameChannel: ({ id, editedChannel }) => axios.patch(routes.channelPath(id), editedChannel, {
    headers: getAuthHeader(),
  }),
  newMessage: (newMessage) => axios.post(routes.messagesPath(), newMessage, {
    headers: getAuthHeader(),
  }),
};

export default restApi;
