import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import AuthContext from '../context/context';
import SignupPage from './SignupPage';
import { getCurrentUser } from '../authData';
import resources from '../locales/index.js';

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
  const i18n = i18next.createInstance();
  i18n
    .use(initReactI18next) // передаем экземпляр i18n в react-i18next, который сделает его доступным для всех компонентов через context API.
    .init({
      resources, // передаем переводы текстов интерфейса в формате JSON
      fallbackLng: 'ru', // если переводы на языке пользователя недоступны, то будет использоваться язык, указанный в этом поле
      interpolation: {
        escapeValue: false, // экранирование уже есть в React, поэтому отключаем
      },
    });

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
