import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import useAuth from '../hooks/authHook';
import Navbar from './Navbar';
import restApi from '../restApi';

const SignupPage = () => {
  const [isInvalid, setValidationStatus] = useState(false);
  const [isDisabled, setDisablesStatus] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ username, password }) => {
      const { logIn, logOut } = auth;
      try {
        setDisablesStatus(true);
        setValidationStatus(false);
        const res = await restApi.signup(username, password);
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
        if (e.response.status === 409) {
          setValidationStatus(true);
        }
        logOut();
      }
      setDisablesStatus(false);
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .min(3, t('validationSchema.generalErr.length'))
        .max(20, t('validationSchema.generalErr.length'))
        .required(t('validationSchema.generalErr.required')),
      password: Yup.string()
        .min(6, t('validationSchema.password.length'))
        .required(t('validationSchema.generalErr.required')),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        t('validationSchema.password.confirm'),
      ),
    }),
  });

  const renderSignupForm = () => (
    <Form className="w-50" onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">{t('signupPage.title')}</h1>
      <Form.Group className="form-floating mb-3" controlId="username">
        <Form.Control
          text="Имя пользователя"
          placeholder={t('validationSchema.generalErr.length')}
          name="username"
          autoComplete="username"
          required
          onChange={formik.handleChange}
          value={formik.values.username}
          isInvalid={!!formik.errors.username || isInvalid}
          disabled={isDisabled}
        />
        <Form.Label>{t('signupPage.form.fields.username')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.username || ''}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-3" controlId="password">
        <Form.Control
          text="Пароль"
          placeholder={t('validationSchema.password.length')}
          name="password"
          aria-describedby="passwordHelpBlock"
          required
          autoComplete="new-password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={!!formik.errors.password || isInvalid}
          disabled={isDisabled}
        />
        <Form.Label>{t('signupPage.form.fields.password')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.password || ''}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="form-floating mb-3" controlId="confirmPassword">
        <Form.Control
          text="Подтвердите пароль"
          placeholder={t('validationSchema.password.confirm')}
          name="confirmPassword"
          required
          autoComplete="new-password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          isInvalid={!!formik.errors.confirmPassword || isInvalid}
          disabled={isDisabled}
        />
        <Form.Label>{t('signupPage.form.fields.confirm')}</Form.Label>
        <Form.Control.Feedback type="invalid" tooltip>
          {formik.errors.confirmPassword || t('signupPage.form.errors')}
        </Form.Control.Feedback>
      </Form.Group>
      <Button
        type="submit"
        variant="outline-primary"
        className="w-100"
        disabled={isDisabled}
      >
        {t('buttons.signup')}
      </Button>
    </Form>
  );

  return (
    <div className="h-100 d-flex flex-column" id="chat">
      <Navbar />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <div>
                  <img
                    src="https://frontend-chat-ru.hexlet.app/static/media/avatar_1.6084447160acc893a24d.jpg"
                    alt="Регистрация"
                    className="rounded-circle"
                  />
                </div>
                {renderSignupForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
