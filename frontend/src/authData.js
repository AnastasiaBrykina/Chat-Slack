const getCurrentUser = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    return null;
  }

  return currentUser;
};

const getAuthHeader = () => {
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.token) {
    return { Authorization: `Bearer ${currentUser.token}` };
  }

  return {};
};

const getCurrentUserName = () => {
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.username) {
    return currentUser.username;
  }

  return null;
};

export { getCurrentUser, getAuthHeader, getCurrentUserName };
