import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';

import { setModalInfo } from '../slices/modals';
import { renameChannel } from '../slices/channels';

const ChannelsRenameModal = () => {
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const channels = useSelector((state) => state.channels.channels);
  const modalInfo = useSelector((state) => state.modals.modalInfo);
  const status = useSelector((state) => state.channels.status);
  const { channel } = modalInfo;

  const channelsNames = channels.map(({ name }) => name);

  const isDesabled = status === 'sending';

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    onSubmit: ({ name }) => {
      const editedChannel = { name };
      dispatch(renameChannel({ editedChannel, id: channel.id }));
      dispatch(setModalInfo({ type: null }));
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
          Переименовать канал
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

export default ChannelsRenameModal;
