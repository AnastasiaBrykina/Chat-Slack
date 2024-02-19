import { useTranslation } from 'react-i18next';

import Navbar from './Navbar';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-100 d-flex flex-column" id="chat">
      <Navbar />
      <div className="text-center">
        <h1 className="h4 text-muted">{t('notFoundPage.title')}</h1>
        <p className="text-muted">
          {t('notFoundPage.text')}
          <a href="/login">
            {' '}
            {t('notFoundPage.link')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
