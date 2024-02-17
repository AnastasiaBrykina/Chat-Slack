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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, ErrorBoundary } from '@rollbar/react';
import * as filter from 'leo-profanity';

import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import AuthContext from '../context/context';
import SignupPage from './SignupPage';
import NotFoundPage from './NotFoundPage';
import { getCurrentUser } from '../authData';
import resources from '../locales/index.js';
import rollbarConfig from '../rollBar';

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
  filter.add(filter.getDictionary('ru'));

  const i18n = i18next.createInstance();
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
