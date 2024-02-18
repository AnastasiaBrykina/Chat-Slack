import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity';

import { getCurrentUserName } from '../../authData';
import restApi from '../../restApi';

const MessagesForm = () => {
  const inputEl = useRef(null);
  const [isDisabled, setDisablesStatus] = useState(false);
  const loadStatus = useSelector((state) => state.messages.isLoading);
  const currentChannel = useSelector((state) => state.channels.selectedChannel);
  const { t } = useTranslation();

  useEffect(() => {
    inputEl.current.focus();
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }) => {
      const filterBody = filter.clean(body);
      try {
        setDisablesStatus(true);
        const newMessage = {
          body: filterBody,
          channelId: currentChannel.id,
          username: getCurrentUserName(),
        };
        await restApi.newMessage(newMessage);
      } catch (e) {
        console.error(e);
        toast.error(t('toast.error'));
      }
      setDisablesStatus(false);
      formik.values.body = '';
    },
  });

  const isDesabledBtn = !formik.values.body.trim() || isDisabled || loadStatus;

  return (
    <Form className="border rounded-2" onSubmit={formik.handleSubmit}>
      <InputGroup id="body">
        <Form.Control
          id="messagesInput"
          name="body"
          placeholder={t('chatPage.messages.form.body')}
          aria-label="Новое сообщение"
          className="border-0 p-0 ps-2"
          onChange={formik.handleChange}
          value={formik.values.body}
          disabled={isDisabled}
          ref={inputEl}
        />
        <Button
          variant="outline-secondary"
          className="btn btn-group-vertical"
          type="submit"
          disabled={isDesabledBtn}
        >
          {t('buttons.send')}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessagesForm;
