import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import useAuth from '../hooks/authHook';
import Navbar from './Navbar';
import restApi from '../restApi';

const LoginPage = () => {
  const [isInvalid, setValidationStatus] = useState(false);
  const [isDisabled, setDisablesStatus] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const { logIn, logOut } = auth;

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        setValidationStatus(false);
        setDisablesStatus(true);
        const res = await restApi.login(values);
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        logIn();
        navigate('/');
      } catch (e) {
        console.error(e);
        if (e.isAxiosError && e.message === 'Network Error') {
          toast.error(t('toast.error'));
          setDisablesStatus(false);
          return;
        }
        if (e.response.status === 401) {
          setValidationStatus(true);
        }
        logOut();
      }
      setDisablesStatus(false);
    },
  });

  const renderLoginForm = () => {
    return (
      <Form
        className="col-12 col-md-8 mt-3 mt-mb-0"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-center mb-4">{t('loginPage.title')}</h1>
        <Form.Group className="form-floating mb-3" controlId="username">
          <Form.Control
            name="username"
            autoComplete="username"
            required
            type="text"
            placeholder={t('loginPage.form.fields.username')}
            onChange={formik.handleChange}
            value={formik.values.username}
            disabled={isDisabled}
            isInvalid={isInvalid}
          />
          <Form.Label>{t('loginPage.form.fields.username')}</Form.Label>
        </Form.Group>
        <Form.Group className="form-floating mb-4" controlId="password">
          <Form.Control
            name="password"
            autoComplete="current-password"
            required
            type="password"
            placeholder={t('loginPage.form.fields.password')}
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={isDisabled}
            isInvalid={isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {t('loginPage.form.errors')}
          </Form.Control.Feedback>
          <Form.Label>{t('loginPage.form.fields.password')}</Form.Label>
        </Form.Group>
        <Button
          type="submit"
          variant="outline-primary"
          className="w-100 mb-3"
          disabled={isDisabled}
        >
          {t('buttons.enter')}
        </Button>
      </Form>
    );
  };

  return (
    <div className="h-100 d-flex flex-column" id="chat">
      <Navbar />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5 d-flex justify-content-center">
                {renderLoginForm()}
              </div>
              <div className="card-footer p-4">
                <div className="d-flex justify-content-center">
                  <span>{t('loginPage.footer.text')}</span>
                  <Button
                    href="/signup"
                    variant="link"
                    className="p-0"
                    disabled={isDisabled}
                  >
                    {t('buttons.loogin')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
