import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useEffect, useRef } from 'react';

import { setModalInfo } from '../slices/modals';
import { addChannel } from '../slices/channels';

const ChannelsAddModal = () => {
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const channels = useSelector((state) => state.channels.channels);
  const status = useSelector((state) => state.channels.status);
  const channelsNames = channels.map(({ name }) => name);
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  const { username } = currentUser;

  const isDesabled = status === 'sending';

  useEffect(() => inputEl.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      const newChannel = { name, username };
      dispatch(addChannel({ newChannel }));
      dispatch(setModalInfo({ type: null }));
      formik.values.name = '';
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов')
        .notOneOf(channelsNames, 'Должно быть уникальным')
        .required('Обязательное поле'),
    }),
  });

  return (
    <Modal
      show="true"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить канал
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => dispatch(setModalInfo({ type: null }))}
          disabled={isDesabled}
        />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label className="visually-hidden"></Form.Label>
            <Form.Control
              name="name"
              className="mb-2"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
              ref={inputEl}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => dispatch(setModalInfo({ type: null }))}
              type="button"
              className="me-2"
              disabled={isDesabled}
            >
              Отменить
            </Button>
            <Button type="submit" disabled={isDesabled}>
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChannelsAddModal;
