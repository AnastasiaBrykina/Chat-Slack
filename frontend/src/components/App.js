import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import NotFoundPage from './NotFoundPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NotFoundPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
