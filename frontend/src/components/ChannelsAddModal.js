import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { setModalInfo } from '../slices/modals';
import { getCurrentUserName } from '../authData';
import restApi from '../restApi';

const ChannelsAddModal = () => {
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  const [isDisabled, setDisablesStatus] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const channelsNames = channels.map(({ name }) => name);

  const { t } = useTranslation();

  useEffect(() => inputEl.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async ({ name }) => {
      try {
        setDisablesStatus(true);
        await restApi.newChannel({
          name: name.trim(),
          username: getCurrentUserName(),
        });
        dispatch(setModalInfo({ type: null }));
        formik.values.name = '';
      } catch (e) {
        console.log(e);
      }
      setDisablesStatus(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(3, t('validationSchema.generalErr.length'))
        .max(20, t('validationSchema.generalErr.length'))
        .notOneOf(channelsNames, t('validationSchema.channel.unique'))
        .required(t('validationSchema.generalErr.required')),
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
          {t('chatPage.modals.add')}
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
              {t('buttons.cancel')}
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {t('buttons.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChannelsAddModal;
