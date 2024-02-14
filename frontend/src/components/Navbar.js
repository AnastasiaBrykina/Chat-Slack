import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useAuth from '../hooks/authHook';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { loggedIn, logOut } = auth;

  const { t } = useTranslation();

  const logOutHundler = () => {
    logOut();
    navigate('/login');
  };

  const renderLogOutBtn = () => {
    if (!loggedIn) return null;

    return (
      <Button type="button" variant="primary" onClick={logOutHundler}>
        {t('buttons.exit')}
      </Button>
    );
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">
          {t('header.title')}
        </a>
        {renderLogOutBtn()}
      </div>
    </nav>
  );
};

export default Navbar;
