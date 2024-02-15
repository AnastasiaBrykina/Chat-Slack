const rollbarConfig = {
  accessToken: '113ea39c3cf045b6b975ea4256f8426e',
  environment: 'testenv',
};

function TestError() {
  const a = null;
  return a.hello();
}

export default rollbarConfig;
export { TestError };
