import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import { io } from 'socket.io-client';

import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import AuthContext from '../context/context';

const socket = io('http://localhost:3000');

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    window.localStorage.removeItem('currentUser');
    setLoggedIn(false);
  };

  const value = { loggedIn, logIn, logOut, socket };

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

const App = () => (
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
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
