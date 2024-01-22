import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/authHook';

const LoginPage = () => {
  const [isInvalid, setValidationStatus] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const dataForm = {
    username: '',
    password: '',
  };

  const formik = useFormik({
    initialValues: dataForm,
    onSubmit: async (values) => {
      const { logIn, logOut } = auth;
      try {
        const res = await axios.post(routes.loginPath(), values);
        window.localStorage.setItem('currentUser', JSON.stringify(res.data));
        logIn();
        setValidationStatus(false);
        navigate('/');
      } catch (e) {
        logOut();
        setValidationStatus(true);
      }
    },
  });

  const renderLoginForm = () => {
    return (
      <Form
        className="col-12 col-md-100 mt-3 mt-mb-0"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-center mb-4">Войти</h1>
        <Form.Group className="form-floating mb-3" controlId="username">
          <Form.Control
            name="username"
            autoComplete="username"
            required
            type="text"
            placeholder="Ваш ник"
            onChange={formik.handleChange}
            value={formik.values.username}
            isInvalid={isInvalid}
          />
          <Form.Label>Ваш ник</Form.Label>
        </Form.Group>
        <Form.Group className="form-floating mb-4" controlId="password">
          <Form.Control
            name="password"
            autoComplete="current-password"
            required
            type="password"
            placeholder="Пароль"
            onChange={formik.handleChange}
            value={formik.values.password}
            isInvalid={isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            Неверные имя пользователя или пароль
          </Form.Control.Feedback>
          <Form.Label>Пароль</Form.Label>
        </Form.Group>
        <Button type="submit" variant="outline-primary" className="w-100 mb-3">
          Войти
        </Button>
      </Form>
    );
  };

  return (
    <div className="h-100 d-flex flex-column" id="chat">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/login">
            Hexlet Chat
          </a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">{renderLoginForm()}</div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>Нет аккаунта?</span>
                  <span>Регистрация</span>
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
