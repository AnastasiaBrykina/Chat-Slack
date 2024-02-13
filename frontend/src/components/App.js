import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';

import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import AuthContext from '../context/context';
import SignupPage from './SignupPage';
import { getCurrentUser } from '../authData';

const AuthProvider = ({ children }) => {
  const currentUser = getCurrentUser();
  const currentUserIsLoggedIn = currentUser && currentUser.token ? true : false;
  const [loggedIn, setLoggedIn] = useState(currentUserIsLoggedIn);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    window.localStorage.removeItem('currentUser');
    setLoggedIn(false);
  };

  const value = { loggedIn, logIn, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const currentUser = localStorage.getItem('currentUser');

  return currentUser ? (
    children
  ) : (
    <Navigate to={'/login'} state={location}></Navigate>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
