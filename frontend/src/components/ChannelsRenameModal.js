import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';

import { setModalInfo } from '../slices/modals';
import restApi from '../restApi';

const ChannelsRenameModal = () => {
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const [isDisabled, setDisablesStatus] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const modalInfo = useSelector((state) => state.modals.modalInfo);

  const { channel } = modalInfo;

  const channelsNames = channels.map(({ name }) => name);

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    onSubmit: async ({ name }) => {
      try {
        setDisablesStatus(true);
        const editedChannel = { name: name.trim() };
        await restApi.renameChannel({ id: channel.id, editedChannel });
        dispatch(setModalInfo({ type: null }));
      } catch (e) {
        console.log(e);
      }
      setDisablesStatus(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .trim()
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
          disabled={isDisabled}
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
              disabled={isDisabled}
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
              disabled={isDisabled}
            >
              Отменить
            </Button>
            <Button type="submit" disabled={isDisabled}>
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChannelsRenameModal;
