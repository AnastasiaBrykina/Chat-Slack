const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  channels: () => [apiPath, 'channels'].join('/'),
  messages: () => [apiPath, 'messages'].join('/'),
  addMessage: () => [apiPath, 'messages'].join('/'),
};

export default routes;
