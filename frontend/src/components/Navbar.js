import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/authHook';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { loggedIn, logOut } = auth;

  const logOutHundler = () => {
    logOut();
    navigate('/login');
  };

  const renderLogOutBtn = () => {
    if (!loggedIn) return null;

    return (
      <Button type="button" variant="primary" onClick={logOutHundler}>
        Выйти
      </Button>
    );
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          Hexlet Chat
        </a>
        {renderLogOutBtn()}
      </div>
    </nav>
  );
};

export default Navbar;
